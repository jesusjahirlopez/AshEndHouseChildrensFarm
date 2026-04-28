// ======== SCRIPT EXCLUSIVO — Contacto.html ========

(function () {
  "use strict";

  // ——— Año en footer ———
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ——— Navegación y menú ———
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var menu   = document.getElementById("nav-menu");
  if (!header || !toggle || !menu) return;

  var mq          = window.matchMedia("(min-width: 901px)");
  var infoToggle  = document.getElementById("nav-info-toggle");
  var infoSubmenu = document.getElementById("nav-info-submenu");
  var infoDropdown = infoToggle && infoToggle.closest(".nav-dropdown");

  function setOpen(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    document.body.classList.toggle("nav-menu-open", open);
  }

  function closeMenu() { setOpen(false); }

  function setInfoDropdownOpen(open) {
    if (!infoDropdown || !infoToggle || !infoSubmenu) return;
    infoDropdown.classList.toggle("is-open", open);
    infoToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { infoSubmenu.removeAttribute("hidden"); }
    else { infoSubmenu.setAttribute("hidden", ""); }
  }

  function closeInfoDropdown() { setInfoDropdownOpen(false); }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("nav-open"));
  });

  if (infoToggle && infoDropdown) {
    infoToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setInfoDropdownOpen(!infoDropdown.classList.contains("is-open"));
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
    if (e.matches) { closeMenu(); closeInfoDropdown(); }
  });

})();


// ======== FORMULARIO DE CONTACTO ========

(function () {
  "use strict";

  var form = document.getElementById('contacto-form');
  if (!form) return;

  // ——— Validación al enviar ———
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    function showErr(idInput, idError) {
      var input   = document.getElementById(idInput);
      var errorEl = document.getElementById(idError);
      if (errorEl) errorEl.removeAttribute('hidden');
      if (input)   input.classList.add('input-error');
      valid = false;
    }

    function hideErr(idInput, idError) {
      var input   = document.getElementById(idInput);
      var errorEl = document.getElementById(idError);
      if (errorEl) errorEl.setAttribute('hidden', '');
      if (input)   input.classList.remove('input-error');
    }

    // Nombre
    var nombre = document.getElementById('nombre').value.trim();
    nombre.length >= 2 ? hideErr('nombre', 'err-nombre') : showErr('nombre', 'err-nombre');

    // Apellido
    var apellido = document.getElementById('apellido').value.trim();
    apellido.length >= 2 ? hideErr('apellido', 'err-apellido') : showErr('apellido', 'err-apellido');

    // Correo
    var correo = document.getElementById('correo').value.trim();
    var correoRegex = /^[^\s@]+@(gmail|outlook|hotmail|yahoo|icloud|live|protonmail|msn)\.(com|mx|es|net|org)$/i;
    correoRegex.test(correo) ? hideErr('correo', 'err-correo') : showErr('correo', 'err-correo');

    // Asunto
    var asunto = document.getElementById('asunto').value.trim();
    asunto.length >= 5 ? hideErr('asunto', 'err-asunto') : showErr('asunto', 'err-asunto');

    if (!valid) {
      var primerError = form.querySelector('.input-error');
      if (primerError) primerError.focus();
      return;
    }

    // Mostrar modal de éxito
    var overlay = document.getElementById('modal-contacto-overlay');
    if (overlay) overlay.removeAttribute('hidden');
  });

  // ——— Limpiar errores mientras escribe ———
  ['nombre', 'apellido', 'asunto'].forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', function () {
      if (input.value.trim().length >= 2) {
        var err = document.getElementById('err-' + id);
        if (err) err.setAttribute('hidden', '');
        input.classList.remove('input-error');
      }
    });
  });

  var correoInput = document.getElementById('correo');
  if (correoInput) {
    correoInput.addEventListener('input', function () {
      var regex = /^[^\s@]+@(gmail|outlook|hotmail|yahoo|icloud|live|protonmail|msn)\.(com|mx|es|net|org)$/i;
      if (regex.test(correoInput.value.trim())) {
        var err = document.getElementById('err-correo');
        if (err) err.setAttribute('hidden', '');
        correoInput.classList.remove('input-error');
      }
    });
  }

  // ——— Cerrar modal de éxito ———
  var modalClose = document.getElementById('modal-contacto-close');
  if (modalClose) {
    modalClose.addEventListener('click', function () {
      var overlay = document.getElementById('modal-contacto-overlay');
      if (overlay) overlay.setAttribute('hidden', '');
      form.reset();
    });
  }

})();