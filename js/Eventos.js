/* ============================================================
   Eventos.js — SCRIPT COMPLETO Y AUTOSUFICIENTE para Eventos.html
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Año dinámico en el footer ── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── 2. Referencias al DOM ── */
  var header      = document.getElementById("site-header");
  var toggle      = document.getElementById("nav-toggle");
  var menu        = document.getElementById("nav-menu");

  if (!header || !toggle || !menu) return;

  var infoToggle   = document.getElementById("nav-info-toggle");
  var infoSubmenu  = document.getElementById("nav-info-submenu");
  var infoDropdown = infoToggle && infoToggle.closest(".nav-dropdown");

  var mq = window.matchMedia("(min-width: 901px)");

  /* ── 3. Menú hamburguesa ── */
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

  /* Cierra submenú al hacer clic fuera */
  document.addEventListener("click", function (e) {
    if (
      infoDropdown &&
      infoDropdown.classList.contains("is-open") &&
      !infoDropdown.contains(e.target)
    ) {
      setInfoOpen(false);
    }
  });

  /* Cierra submenú y menú móvil al pulsar un enlace */
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setInfoOpen(false);
      if (!mq.matches) setMenuOpen(false);
    });
  });

  /* Cierra con Escape */
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

})();
