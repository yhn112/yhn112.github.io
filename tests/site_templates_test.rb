# frozen_string_literal: true

# Render individual overrides with Liquid; this does not build or serve the site.
require "jekyll"
require "al_folio_core"
require "al_analytics"
require "al_citations"
require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)
CONFIG = YAML.safe_load_file(File.join(ROOT, "_config.yml"))
DATA = %w[socials citations venues].to_h do |name|
  [name, YAML.safe_load_file(File.join(ROOT, "_data", "#{name}.yml"))]
end

SiteContext = Struct.new(:config, :filter_cache, :source, keyword_init: true)

def render_override(path, page: {}, extra: {}, config: {})
  values = CONFIG.merge("data" => DATA).merge(config)
  site = SiteContext.new(config: values, filter_cache: {}, source: ROOT)
  template = File.read(File.join(ROOT, path)).sub(/\A---\n.*?\n---\n/m, "")
  Liquid::Template.parse(template, error_mode: :strict).render!(
    { "site" => values, "page" => page, "jekyll" => { "environment" => "production" } }.merge(extra),
    registers: { site: site }
  )
end

def check(name)
  yield
  puts "PASS: #{name}"
end

def assert(condition, message)
  raise message unless condition
end

["/", "/cv/", "/publications/", "/privacy/"].each do |url|
  check("JSON-LD escapes descriptions and titles on #{url}") do
    description = "Research \"notes\"\nwith a second line and a backslash \\."
    title = "A \"quoted\" title"
    html = render_override("_includes/metadata.liquid", page: { "url" => url, "title" => title, "description" => description })
    json = html.match(%r{<script type="application/ld\+json">(.*?)</script>}m)[1]
    schema = JSON.parse(json)
    assert(schema["description"] == description, "Description changed or is invalid JSON")
    assert(schema["headline"] == (url == "/" ? "Michael Diskin" : title), "Unexpected headline")
    assert(schema["url"] == "https://diskin.me#{url}", "Canonical URL changed")
  end
end

check("Google and Yandex load once without a consent gate") do
  html = render_override("_includes/plugins/al_analytics_scripts.liquid")
  assert(html.scan("googletagmanager.com/gtag/js?id=G-0EB0Q3MDWZ").size == 1, "Google counter missing or duplicated")
  assert(html.scan("/assets/js/yandex-metrika-setup.js").size == 1, "Yandex counter missing or duplicated")
  assert(!html.include?('type="text/plain"'), "Analytics unexpectedly requires consent")
end

check("Disabled analytics providers emit no scripts") do
  html = render_override("_includes/plugins/al_analytics_scripts.liquid", config: { "enable_google_analytics" => false, "enable_yandex_metrika" => false })
  assert(!html.include?("<script"), "Disabled analytics still emits scripts")
end

check("CV PDF keeps its URL and has an accessible name") do
  html = render_override(
    "_includes/cv/render.liquid",
    page: { "title" => "CV", "cv_format" => "rendercv", "cv_pdf" => "/assets/rendercv/rendercv_output/Michael_Diskin_CV.pdf" },
    config: { "data" => { "cv" => { "cv" => { "name" => "Michael Diskin", "sections" => {} } } } }
  )
  assert(html.include?('aria-label="Download CV as PDF"'), "PDF download has no accessible name")
  assert(html.include?('href="/assets/rendercv/rendercv_output/Michael_Diskin_CV.pdf"'), "PDF URL changed")
  assert(html.include?("Michael Diskin"), "RenderCV content is missing")
  assert(html.scan(/<h([1-6])\b/).flatten == ["1", "2"], "CV section headings skip a level")
end

check("Publication badges use the committed citation cache") do
  key, paper = DATA.fetch("citations").fetch("papers").find { |_, cached| cached["citations"] }
  assert(paper, "Citation cache has no paper with a citation count")
  entry = { "key" => "cached-paper", "title" => paper.fetch("title"), "author_array" => [], "google_scholar_id" => key.split(":").last, "bibtex" => "@article{cached-paper}" }
  html = render_override("_layouts/bib.liquid", extra: { "entry" => entry })
  assert(html.include?("#{paper.fetch('citations')} Google Scholar citations"), "Cached citation count was not rendered")
end

check("Venue text meets WCAG AA contrast") do
  luminance = lambda do |hex|
    rgb = hex.delete_prefix("#").scan(/../).map { |value| value.to_i(16) / 255.0 }
    rgb.zip([0.2126, 0.7152, 0.0722]).sum do |value, weight|
      weight * (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055)**2.4)
    end
  end
  DATA.fetch("venues").each do |name, venue|
    low, high = [luminance.call(venue.fetch("color")), luminance.call(venue.fetch("text_color", "#ffffff"))].sort
    assert((high + 0.05) / (low + 0.05) >= 4.5, "Insufficient venue contrast: #{name}")
  end
end
