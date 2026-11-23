import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Builder, By, logging, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const base = process.env.SITE_URL;
assert(base, "SITE_URL must point to the CI artifact server");
const options = new chrome.Options().addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
options.setChromeBinaryPath(process.env.CHROME_PATH);
options.setPageLoadStrategy("eager");
const logPreferences = new logging.Preferences();
logPreferences.setLevel(logging.Type.BROWSER, logging.Level.ALL);
options.setLoggingPrefs(logPreferences);
const service = new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH);
const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).setChromeService(service).build();
const sections = ["/", "/publications/", "/cv/", "/teaching/", "/repositories/", "/news/", "/privacy/"];
await mkdir("test-results", { recursive: true });

async function collectionRoutes(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) routes.push(...(await collectionRoutes(file)));
    else if (file.endsWith(".html")) routes.push("/" + path.relative("_site", file).replace(/index\.html$/, ""));
  }
  return routes;
}

async function checkPage(route, theme, width) {
  const response = await fetch(base + route);
  await response.arrayBuffer();
  assert.equal(response.status, 200, `Missing route: ${route}`);
  await driver.get(base + route);
  await driver.wait(async () => (await driver.executeScript("return document.documentElement.dataset.theme")) === theme, 10000);
  const data = await driver.executeScript(() => ({
    json: [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent),
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    assets: [...document.querySelectorAll('script[src], link[rel="stylesheet"]')].map((node) => ({
      url: node.src || node.href,
      integrity: node.integrity,
    })),
    google: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
    yandex: document.querySelectorAll('script[src*="yandex-metrika-setup.js"]').length,
    consentGates: document.querySelectorAll('script[type="text/plain"][data-category="analytics"]').length,
    privacyLink: !!document.querySelector('footer a[href="/privacy/"]'),
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    heading: document.querySelector("h1")?.textContent.trim(),
    navbar: {
      top: document.querySelector("#navbar").getBoundingClientRect().top,
      width: document.querySelector("#navbar").getBoundingClientRect().width,
      viewport: document.documentElement.clientWidth,
    },
  }));
  if (!route.startsWith("/news/announcement")) assert(data.heading, `Missing page heading: ${route}`);
  assert(data.json.length, `Missing JSON-LD: ${route}`);
  for (const json of data.json) JSON.parse(json);
  assert.equal(data.canonical, "https://diskin.me" + route, `Wrong canonical: ${route}`);
  assert.equal(data.google, 1, `Google loaded more or less than once: ${route}`);
  assert.equal(data.yandex, 1, `Yandex loaded more or less than once: ${route}`);
  assert.equal(data.consentGates, 0, `Unexpected consent gate: ${route}`);
  assert(data.privacyLink, `Missing privacy footer link: ${route}`);
  assert(!data.overflow, `Horizontal overflow at ${width}px: ${route}`);
  assert(
    Math.abs(data.navbar.top) < 1 && Math.abs(data.navbar.width - data.navbar.viewport) < 1,
    `Fixed navbar does not span the viewport: ${route}, ${JSON.stringify(data.navbar)}`
  );
  const localAssets = new Map(data.assets.filter((asset) => asset.url.startsWith(base + "/")).map((asset) => [asset.url, asset]));
  for (const { url, integrity } of localAssets.values()) {
    const resource = await fetch(url);
    const bytes = Buffer.from(await resource.arrayBuffer());
    assert.equal(resource.status, 200, `Missing asset: ${url}`);
    if (integrity) {
      const valid = integrity.split(/\s+/).some((token) => {
        const [algorithm, digest] = token.split("-");
        return createHash(algorithm).update(bytes).digest("base64") === digest;
      });
      assert(valid, `Browser asset integrity mismatch: ${url}`);
    }
  }
  await driver.wait(
    () =>
      driver.executeScript(() =>
        [...document.images].filter((img) => img.src.startsWith(location.origin)).every((img) => img.complete && img.naturalWidth > 0)
      ),
    15000,
    `Broken local image: ${route}`
  );
  const errors = (await driver.manage().logs().get(logging.Type.BROWSER)).filter((entry) =>
    /Uncaught|SyntaxError|ReferenceError|TypeError/.test(entry.message)
  );
  assert.equal(errors.length, 0, `JavaScript errors on ${route}: ${JSON.stringify(errors)}`);
  if (sections.includes(route)) {
    const name = `${route.replaceAll("/", "_") || "home"}-${theme}-${width}.png`;
    await writeFile(path.join("test-results", name), await driver.takeScreenshot(), "base64");
  }
  console.log(`PASS: ${route} (${theme}, ${width}px)`);
}

try {
  const teaching = await collectionRoutes("_site/teachings");
  const news = await collectionRoutes("_site/news");
  const teachingSources = (await readdir("_teachings")).filter((file) => file.endsWith(".md"));
  const newsSources = (await readdir("_news")).filter((file) => file.endsWith(".md"));
  assert.equal(teaching.length, teachingSources.length, "A teaching page was lost");
  assert.equal(news.length, newsSources.length + 1, "A news page or its index was lost");
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 390]) {
      await driver.sendDevToolsCommand("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 576 });
      await driver.get(base + "/");
      await driver.executeScript("localStorage.setItem('theme', arguments[0])", theme);
      const routes = theme === "light" && width === 1440 ? [...sections, ...teaching, ...news, "/404.html"] : sections;
      for (const route of [...new Set(routes)]) await checkPage(route, theme, width);

      await driver.get(base + "/");
      await driver.wait(
        () => driver.executeScript(() => [...document.fonts].some((font) => font.family.includes("Font Awesome 7 Free") && font.status === "loaded")),
        10000,
        "The local icon font did not load"
      );
      await driver.findElement(By.id("light-toggle")).click();
      await driver.wait(async () => (await driver.executeScript("return localStorage.getItem('theme')")) !== theme, 5000);
      await driver.executeScript("setThemeSetting(arguments[0])", theme);
      if (width < 576) {
        const toggle = await driver.findElement(By.css("[data-nav-toggle]"));
        await toggle.click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.id("navbarNav"))), 5000);
        await toggle.click();
        await driver.wait(until.elementIsNotVisible(await driver.findElement(By.id("navbarNav"))), 5000);
      }

      await driver.get(base + "/publications/");
      const search = await driver.findElement(By.id("bibsearch"));
      await search.sendKeys("Swarm");
      await driver.wait(
        async () => {
          const visible = await driver.executeScript(() =>
            [...document.querySelectorAll("ol.bibliography > li")].filter((node) => node.getClientRects().length).map((node) => node.textContent)
          );
          return visible.length === 1 && visible[0].toLowerCase().includes("swarm parallelism");
        },
        5000,
        "Publication filtering did not select Swarm"
      );
      const publication = await driver.findElement(By.css("ol.bibliography > li:not(.unloaded)"));
      const bibButton = await publication.findElement(By.css("a.bibtex"));
      const bibPanel = await publication.findElement(By.css("div.bibtex"));
      await bibButton.click();
      await driver.wait(until.elementIsVisible(bibPanel), 5000);
      assert.equal(await bibPanel.findElement(By.css("pre")).getAttribute("tabindex"), "0", "BibTeX code is not keyboard-scrollable");
      await bibButton.click();
      await driver.wait(until.elementIsNotVisible(bibPanel), 5000);
      await search.clear();
    }
  }
  await driver.get(base + "/cv/");
  const cvText = await driver.findElement(By.css(".cv")).getText();
  for (const section of ["Experience", "Education", "Skills", "Awards", "Languages"]) {
    assert(cvText.includes(section), `CV section missing: ${section}`);
  }
  const download = await driver.findElement(By.css('a[aria-label="Download CV as PDF"]'));
  const pdfPath = "/assets/rendercv/rendercv_output/Michael_Diskin_CV.pdf";
  assert.equal(await download.getAttribute("href"), base + pdfPath);
  const pdf = await fetch(base + pdfPath);
  assert.equal(pdf.status, 200);
  const bytes = Buffer.from(await pdf.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  assert(bytes.equals(await readFile("_site" + pdfPath)), "Served PDF differs from the production artifact");
  console.log("PASS: PDF download and browser interactions");
} catch (error) {
  await writeFile("test-results/failure.png", await driver.takeScreenshot(), "base64");
  throw error;
} finally {
  await driver.quit();
}
