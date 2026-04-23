$(document).ready(function () {
  // add toggle functionality to abstract, award, bibtex and embedded video buttons
  var toggleConfigs = [
    { buttonClass: "abstract-toggle", panelClass: "abstract" },
    { buttonClass: "award-toggle", panelClass: "award" },
    { buttonClass: "bibtex-toggle", panelClass: "bibtex" },
    { buttonClass: "video-toggle", panelClass: "video" },
  ];

  function syncToggleState($entry, config, isOpen) {
    var $panel = $entry.find("." + config.panelClass + ".hidden");
    if (!$panel.length) {
      return;
    }

    $panel.toggleClass("open", isOpen);
    $panel.prop("hidden", !isOpen);
    $entry.find("." + config.buttonClass).attr("aria-expanded", String(isOpen));
  }

  toggleConfigs.forEach(function (config) {
    $("button." + config.buttonClass).click(function () {
      var $entry = $(this).closest(".links").parent();
      var $panel = $entry.find("." + config.panelClass + ".hidden");
      var shouldOpen = $panel.prop("hidden");

      toggleConfigs.forEach(function (currentConfig) {
        syncToggleState($entry, currentConfig, currentConfig.panelClass === config.panelClass ? shouldOpen : false);
      });
    });
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
