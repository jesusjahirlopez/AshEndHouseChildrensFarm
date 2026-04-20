(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!header || !toggle || !menu) return;

  var mq = window.matchMedia("(min-width: 901px)");
  var infoToggle = document.getElementById("nav-info-toggle");
  var infoSubmenu = document.getElementById("nav-info-submenu");
  var infoDropdown = infoToggle && infoToggle.closest(".nav-dropdown");

  function setOpen(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    document.body.classList.toggle("nav-menu-open", open);
  }

  function closeMenu() {
    setOpen(false);
  }

  function setInfoDropdownOpen(open) {
    if (!infoDropdown || !infoToggle || !infoSubmenu) return;
    infoDropdown.classList.toggle("is-open", open);
    infoToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      infoSubmenu.removeAttribute("hidden");
    } else {
      infoSubmenu.setAttribute("hidden", "");
    }
  }

  function closeInfoDropdown() {
    setInfoDropdownOpen(false);
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("nav-open"));
  });

  if (infoToggle && infoDropdown) {
    infoToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var next = !infoDropdown.classList.contains("is-open");
      setInfoDropdownOpen(next);
    });
  }

  document.addEventListener("click", function (e) {
    if (infoDropdown && infoDropdown.classList.contains("is-open") && !infoDropdown.contains(e.target)) {
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
})();
