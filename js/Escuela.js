/* ============================================================
   Escuela.js — SCRIPT COMPLETO Y AUTOSUFICIENTE para Escuelas.html
   No requiere ningún otro archivo JS
   Cubre: año en footer, menú hamburguesa, submenú Información,
          modo oscuro y ajuste de tamaño de letra.
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Año dinámico en el footer ── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── 2. Referencias al DOM ── */
  var header       = document.getElementById("site-header");
  var toggle       = document.getElementById("nav-toggle");
  var menu         = document.getElementById("nav-menu");

  if (!header || !toggle || !menu) return; // guardia: si no existe la nav, salir

  var infoToggle   = document.getElementById("nav-info-toggle");
  var infoSubmenu  = document.getElementById("nav-info-submenu");
  var infoDropdown = infoToggle && infoToggle.closest(".nav-dropdown");

  /* Media query: pantalla ancha (escritorio) */
  var mq = window.matchMedia("(min-width: 901px)");

  /* ── 3. Menú hamburguesa (móvil) ── */
  function setMenuOpen(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
    document.body.classList.toggle("nav-menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenuOpen(!header.classList.contains("nav-open"));
  });

  /* ── 4. Submenú "Información" ── */
  function setInfoOpen(open) {
    if (!infoDropdown || !infoToggle || !infoSubmenu) return;
    infoDropdown.classList.toggle("is-open", open);
    infoToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      infoSubmenu.removeAttribute("hidden");
    } else {
      infoSubmenu.setAttribute("hidden", "");
    }
  }

  if (infoToggle && infoDropdown) {
    infoToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setInfoOpen(!infoDropdown.classList.contains("is-open"));
    });
  }

  /* Cierra el submenú al hacer clic fuera */
  document.addEventListener("click", function (e) {
    if (
      infoDropdown &&
      infoDropdown.classList.contains("is-open") &&
      !infoDropdown.contains(e.target)
    ) {
      setInfoOpen(false);
    }

    // Modo oscuro
  var darkBtn = document.getElementById("btn-dark-mode");
  if (darkBtn) {
    if (localStorage.getItem("ash-dark") === "1") {
      document.body.classList.add("dark-mode");
    }
    darkBtn.addEventListener("click", function () {
      var isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("ash-dark", isDark ? "1" : "0");
      darkBtn.setAttribute("aria-label", isDark ? "Desactivar modo oscuro" : "Activar modo oscuro");
      darkBtn.setAttribute("title", isDark ? "Desactivar modo oscuro" : "Activar modo oscuro");
    });
  }

  // Tamaño de fuente
  var fontBtn = document.getElementById("btn-font-size");
  var fontLevels = ["", "font-md", "font-lg"];
  if (fontBtn) {
    var savedLevel = parseInt(localStorage.getItem("ash-font") || "0", 10);
    if (savedLevel > 0 && savedLevel < fontLevels.length) {
      document.body.classList.add(fontLevels[savedLevel]);
    }
    fontBtn.addEventListener("click", function () {
      var current = 0;
      fontLevels.forEach(function (cls, i) {
        if (cls && document.body.classList.contains(cls)) { current = i; }
      });
      if (fontLevels[current]) { document.body.classList.remove(fontLevels[current]); }
      var next = (current + 1) % fontLevels.length;
      if (fontLevels[next]) { document.body.classList.add(fontLevels[next]); }
      localStorage.setItem("ash-font", String(next));
      var labels = ["Tamano normal", "Tamano mediano", "Tamano grande"];
      fontBtn.setAttribute("title", labels[next]);
      fontBtn.setAttribute("aria-label", labels[next]);
    });
  }
  
  });

  /* Cierra submenú (y menú móvil) al pulsar un enlace */
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setInfoOpen(false);
      if (!mq.matches) setMenuOpen(false);
    });
  });

  /* Cierra con tecla Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (infoDropdown && infoDropdown.classList.contains("is-open")) {
      setInfoOpen(false);
      return;
    }
    setMenuOpen(false);
  });

  /* Al pasar a pantalla ancha, cierra ambos */
  mq.addEventListener("change", function (e) {
    if (e.matches) {
      setMenuOpen(false);
      setInfoOpen(false);
    }
  });

  /* ── 5. Modo oscuro ── */
  var darkBtn = document.getElementById("btn-dark-mode");
  if (darkBtn) {
    /* Restaurar preferencia guardada */
    if (localStorage.getItem("ash-dark") === "1") {
      document.body.classList.add("dark-mode");
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

  /* ── 6. Tamaño de letra (3 niveles cíclicos) ── */
  var fontBtn    = document.getElementById("btn-font-size");
  var fontLevels = ["", "font-md", "font-lg"];

  if (fontBtn) {
    /* Restaurar preferencia guardada */
    var saved = parseInt(localStorage.getItem("ash-font") || "0", 10);
    if (saved > 0 && saved < fontLevels.length) {
      document.body.classList.add(fontLevels[saved]);
    }

    fontBtn.addEventListener("click", function () {
      /* Detectar nivel actual */
      var current = 0;
      fontLevels.forEach(function (cls, i) {
        if (cls && document.body.classList.contains(cls)) current = i;
      });

      /* Quitar nivel actual */
      if (fontLevels[current]) {
        document.body.classList.remove(fontLevels[current]);
      }

      /* Avanzar al siguiente nivel (circular: 0→1→2→0) */
      var next = (current + 1) % fontLevels.length;
      if (fontLevels[next]) {
        document.body.classList.add(fontLevels[next]);
      }

      localStorage.setItem("ash-font", String(next));

      var labels = ["Tamaño normal", "Tamaño mediano", "Tamaño grande"];
      fontBtn.setAttribute("title",      labels[next]);
      fontBtn.setAttribute("aria-label", labels[next]);
    });
  }

})();
