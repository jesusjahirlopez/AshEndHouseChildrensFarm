/**
 * Ash End House — Funcionalidad compartida (nav, modo oscuro, tamaño de texto, búsqueda en página)
 */
(function () {
  "use strict";

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, MARK: 1 };
  var EXCLUDE_SELECTORS = ".site-header, .site-footer, .header-search, .nav-submenu";

  /* —— Año en pie —— */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* —— Navegación —— */
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var checkbox = document.getElementById("nav-toggle-checkbox");
  var menu = document.getElementById("nav-menu");

  if (header && menu && (toggle || checkbox)) {
    var mq = window.matchMedia("(min-width: 901px)");
    var infoToggle = document.getElementById("nav-info-toggle");
    var infoSubmenu = document.getElementById("nav-info-submenu");
    var infoDropdown = infoToggle && infoToggle.closest(".nav-dropdown");

    function setOpen(open) {
      header.classList.toggle("nav-open", open);
      if (toggle) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute(
          "aria-label",
          open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
        );
      }
      if (checkbox) checkbox.checked = open;
      document.body.classList.toggle("nav-menu-open", open);
    }

    function closeMenu() {
      setOpen(false);
    }

    function setInfoDropdownOpen(open) {
      if (!infoDropdown || !infoToggle || !infoSubmenu) return;
      infoDropdown.classList.toggle("is-open", open);
      infoToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) infoSubmenu.removeAttribute("hidden");
      else infoSubmenu.setAttribute("hidden", "");
    }

    function closeInfoDropdown() {
      setInfoDropdownOpen(false);
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        setOpen(!header.classList.contains("nav-open"));
      });
    }
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        setOpen(checkbox.checked);
      });
    }

    if (infoToggle && infoDropdown) {
      infoToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        setInfoDropdownOpen(!infoDropdown.classList.contains("is-open"));
      });
    }

    document.addEventListener("click", function (e) {
      if (
        infoDropdown &&
        infoDropdown.classList.contains("is-open") &&
        !infoDropdown.contains(e.target)
      ) {
        closeInfoDropdown();
      }
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeInfoDropdown();
        if (!mq.matches) closeMenu();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (infoDropdown && infoDropdown.classList.contains("is-open")) {
        closeInfoDropdown();
        return;
      }
      closeMenu();
    });

    mq.addEventListener("change", function (e) {
      if (e.matches) {
        closeMenu();
        closeInfoDropdown();
      }
    });
  }

  /* —— Modo oscuro —— */
  var darkBtn = document.getElementById("btn-dark-mode");
  if (darkBtn) {
    if (localStorage.getItem("ash-dark") === "1") {
      document.body.classList.add("dark-mode");
      darkBtn.setAttribute("aria-label", "Desactivar modo oscuro");
      darkBtn.setAttribute("title", "Desactivar modo oscuro");
    }
    darkBtn.addEventListener("click", function () {
      var isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("ash-dark", isDark ? "1" : "0");
      darkBtn.setAttribute(
        "aria-label",
        isDark ? "Desactivar modo oscuro" : "Activar modo oscuro"
      );
      darkBtn.setAttribute(
        "title",
        isDark ? "Desactivar modo oscuro" : "Activar modo oscuro"
      );
    });
  }

  /* —— Tamaño de fuente (doble A) — escala en todo el sitio vía html —— */
  var fontBtn = document.getElementById("btn-font-size");
  var fontHtmlLevels = ["", "ash-font-md", "ash-font-lg"];
  var fontBodyLevels = ["", "font-md", "font-lg"];
  var fontLabels = ["Tamaño normal", "Tamaño mediano", "Tamaño grande"];

  function applyFontLevel(index) {
    fontHtmlLevels.forEach(function (cls) {
      if (cls) document.documentElement.classList.remove(cls);
    });
    fontBodyLevels.forEach(function (cls) {
      if (cls) document.body.classList.remove(cls);
    });
    if (index > 0 && index < fontHtmlLevels.length) {
      document.documentElement.classList.add(fontHtmlLevels[index]);
      document.body.classList.add(fontBodyLevels[index]);
    }
    if (fontBtn) {
      fontBtn.setAttribute("title", fontLabels[index]);
      fontBtn.setAttribute("aria-label", fontLabels[index]);
    }
  }

  if (fontBtn) {
    var savedLevel = parseInt(localStorage.getItem("ash-font") || "0", 10);
    if (savedLevel > 0 && savedLevel < fontHtmlLevels.length) {
      applyFontLevel(savedLevel);
    }

    fontBtn.addEventListener("click", function () {
      var current = 0;
      fontBodyLevels.forEach(function (cls, i) {
        if (cls && document.body.classList.contains(cls)) current = i;
      });
      var next = (current + 1) % fontHtmlLevels.length;
      applyFontLevel(next);
      localStorage.setItem("ash-font", String(next));
    });
  }

  /* —— Eventos: clic en tarjeta para ver información —— */
  document.querySelectorAll(".event-social-card").forEach(function (card) {
    var face = card.querySelector(".card-media-wrapper");
    if (!face) return;
    face.setAttribute("role", "button");
    face.setAttribute("tabindex", "0");
    face.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !card.classList.contains("is-open");
      document.querySelectorAll(".event-social-card.is-open").forEach(function (other) {
        other.classList.remove("is-open");
      });
      if (willOpen) card.classList.add("is-open");
    });
    face.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        face.click();
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".event-social-card")) {
      document.querySelectorAll(".event-social-card.is-open").forEach(function (c) {
        c.classList.remove("is-open");
      });
    }
  });

  /* —— Búsqueda en la página (tipo Ctrl+F) —— */
  var searchForm = document.querySelector(".header-search");
  var searchInput = document.getElementById("q");
  var searchHits = [];
  var searchHitIndex = -1;
  var lastQuery = "";

  function getSearchRoot() {
    return (
      document.getElementById("contenido") ||
      document.querySelector("main.site-main") ||
      document.querySelector("main") ||
      document.body
    );
  }

  function nodeInExcluded(node) {
    if (!node || node.nodeType !== 1) return false;
    return !!node.closest && node.closest(EXCLUDE_SELECTORS);
  }

  function clearSearchHighlights() {
    document.querySelectorAll("mark.search-hit").forEach(function (mark) {
      var parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    searchHits = [];
    searchHitIndex = -1;
    document.body.classList.remove("search-active");
  }

  function highlightMatches(root, query) {
    clearSearchHighlights();
    if (!query) return 0;

    var re;
    try {
      re = new RegExp(escapeRegExp(query), "gi");
    } catch (err) {
      return 0;
    }

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        var parent = node.parentElement;
        if (!parent || SKIP_TAGS[parent.tagName]) {
          return NodeFilter.FILTER_REJECT;
        }
        if (nodeInExcluded(parent)) return NodeFilter.FILTER_REJECT;
        if (parent.closest("mark.search-hit")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function (textNode) {
      var text = textNode.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) return;

      re.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var lastIndex = 0;
      var match;

      while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex, match.index))
          );
        }
        var mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = match[0];
        frag.appendChild(mark);
        searchHits.push(mark);
        lastIndex = re.lastIndex;
        if (match[0].length === 0) re.lastIndex++;
      }

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(frag, textNode);
      }
    });

    if (searchHits.length) document.body.classList.add("search-active");
    return searchHits.length;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function scrollToHit(index) {
    if (!searchHits.length) return;
    searchHits.forEach(function (m, i) {
      m.classList.toggle("search-hit-current", i === index);
    });
    var el = searchHits[index];
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function runPageSearch() {
    if (!searchInput) return;
    var query = searchInput.value.trim();
    if (!query) {
      clearSearchHighlights();
      lastQuery = "";
      return;
    }

    if (query !== lastQuery) {
      lastQuery = query;
      var count = highlightMatches(getSearchRoot(), query);
      searchHitIndex = count > 0 ? 0 : -1;
      if (count > 0) scrollToHit(0);
      else showSearchMessage("No se encontraron coincidencias para \"" + query + "\".");
      return;
    }

    if (!searchHits.length) {
      var total = highlightMatches(getSearchRoot(), query);
      if (!total) {
        showSearchMessage("No se encontraron coincidencias para \"" + query + "\".");
        return;
      }
      searchHitIndex = 0;
    } else {
      searchHitIndex = (searchHitIndex + 1) % searchHits.length;
    }
    scrollToHit(searchHitIndex);
  }

  function showSearchMessage(msg) {
    var banner = document.getElementById("search-status-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "search-status-banner";
      banner.className = "search-status-banner";
      banner.setAttribute("role", "status");
      document.body.appendChild(banner);
    }
    banner.textContent = msg;
    banner.hidden = false;
    clearTimeout(banner._hideTimer);
    banner._hideTimer = setTimeout(function () {
      banner.hidden = true;
    }, 3200);
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      runPageSearch();
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runPageSearch();
      }
    });

    searchInput.addEventListener("input", function () {
      if (!searchInput.value.trim()) clearSearchHighlights();
    });
  }
})();
