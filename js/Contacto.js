// -------- JAVASCRIPT DE CONTACTO --------

(function() {
  "use strict";

  var form = document.getElementById('contacto-form');
  if (!form) return;

  // ——— Validación al enviar ———
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Siempre prevenir recarga

    var valid = true;

    function showErr(idInput, idError) {
      var input = document.getElementById(idInput);
      var errorEl = document.getElementById(idError);
      if (errorEl) errorEl.removeAttribute('hidden');
      if (input) input.classList.add('input-error');
      valid = false;
    }

    function hideErr(idInput, idError) {
      var input = document.getElementById(idInput);
      var errorEl = document.getElementById(idError);
      if (errorEl) errorEl.setAttribute('hidden', '');
      if (input) input.classList.remove('input-error');
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

    // Si todo es válido, mostrar modal de éxito
    var overlay = document.getElementById('modal-contacto-overlay');
    if (overlay) overlay.removeAttribute('hidden');
  });

  // ——— Limpiar error mientras escribe ———
  ['nombre', 'apellido', 'asunto'].forEach(function(id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', function() {
      if (input.value.trim().length >= 2) {
        var err = document.getElementById('err-' + id);
        if (err) err.setAttribute('hidden', '');
        input.classList.remove('input-error');
      }
    });
  });

  var correoInput = document.getElementById('correo');
  if (correoInput) {
    correoInput.addEventListener('input', function() {
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
    modalClose.addEventListener('click', function() {
      var overlay = document.getElementById('modal-contacto-overlay');
      if (overlay) overlay.setAttribute('hidden', '');
      form.reset(); // Limpia el formulario
    });
  }

})();