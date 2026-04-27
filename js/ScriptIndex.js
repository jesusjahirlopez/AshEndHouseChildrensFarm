(function () {
  "use strict";

  // --- 1. Inicialización Global (Año) ---
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // --- 2. Navegación y Menú ---
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


  // --- 3. Modo Oscuro (del Archivo 1) ---
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


  // --- 4. Ajuste de Tamaño de Letra (del Archivo 1) ---
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

      var labels = ["Tamaño normal", "Tamaño mediano", "Tamaño grande"];
      fontBtn.setAttribute("title", labels[next]);
      fontBtn.setAttribute("aria-label", labels[next]);
    });
  }

})();

// --- 5. Modales (Advertencia y Confirmación) ---
(function() {
  var modalOverlay = document.getElementById('modal-overlay');
  var modalMsg = document.getElementById('modal-msg');
  var modalCloseBtn = document.getElementById('modal-close');
  if (!modalOverlay) return;

  window.showModal = function(msg) {
    modalMsg.textContent = msg;
    modalOverlay.removeAttribute('hidden');
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function() {
      modalOverlay.setAttribute('hidden', '');
    });
  }
})();

(function() {
  var confirmCancel = document.getElementById('modal-confirm-cancel');
  var confirmOk = document.getElementById('modal-confirm-ok');
  if (confirmCancel) {
    confirmCancel.addEventListener('click', function() {
      document.getElementById('modal-confirm-overlay').setAttribute('hidden', '');
    });
  }
  if (confirmOk) {
    confirmOk.addEventListener('click', function() {
      document.getElementById('modal-confirm-overlay').setAttribute('hidden', '');
    });
  }
})();

// --- 6. Calendario y Selección de Tickets ---
(function() {
  var grid = document.getElementById('cal-grid');
  if (!grid) return;

  var diasSemana = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var diasSemanaLargo = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  var hoy = new Date();
  var viewYear = hoy.getFullYear();
  var viewMonth = hoy.getMonth();
  var selectedDay = null;

  var label = document.getElementById('cal-month-label');
  var dateBox = document.getElementById('cal-selected-date');
  var dateText = document.getElementById('cal-date-text');

  function renderCal() {
    grid.innerHTML = '';
    label.textContent = meses[viewMonth] + ' ' + viewYear;

    diasSemana.forEach(function(d) {
      var cell = document.createElement('div');
      cell.className = 'cal-day-name';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    var firstDay = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (var i = 0; i < firstDay; i++) {
      var empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;

      var thisDate = new Date(viewYear, viewMonth, d);
      var todayMid = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

      if (thisDate < todayMid) cell.classList.add('past');
      if (thisDate.toDateString() === todayMid.toDateString()) cell.classList.add('today');
      if (selectedDay && thisDate.toDateString() === selectedDay.toDateString()) cell.classList.add('selected');

      (function(date) {
        cell.addEventListener('click', function() {
          selectedDay = date;
          window.calSelectedDay = date;
          renderCal();
          var nombreDia = diasSemanaLargo[date.getDay()];
          var dia = date.getDate();
          var mes = meses[date.getMonth()];
          var anio = date.getFullYear();
          dateText.textContent = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1) + ' ' + dia + ' de ' + mes + ' de ' + anio;
          dateBox.removeAttribute('hidden');
        });
      })(thisDate);

      grid.appendChild(cell);
    }
  }

  document.getElementById('cal-prev').addEventListener('click', function() {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCal();
  });

  document.getElementById('cal-next').addEventListener('click', function() {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCal();
  });

  renderCal();
})();

(function() {
  document.querySelectorAll('.ticket-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var dateBox = document.getElementById('cal-selected-date');
      if (!dateBox || dateBox.hasAttribute('hidden')) {
        window.showModal('Primero debes seleccionar una fecha en el calendario.');
        return;
      }

      var selectedDay = window.calSelectedDay;
      if (selectedDay) {
        var hoy = new Date();
        var todayMid = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        if (selectedDay.toDateString() === todayMid.toDateString()) {
          var timeText = item.querySelector('.ticket-time');
          if (timeText) {
            var partes = timeText.textContent.split('-')[0].trim().split(':');
            var horaEntrada = parseInt(partes[0]);
            var minEntrada = parseInt(partes[1]);
            var limite = new Date();
            limite.setHours(horaEntrada, minEntrada - 30, 0, 0);
            if (new Date() > limite) {
              window.showModal('Solo se puede hacer una reserva 30 minutos antes de cada entrada.');
              return;
            }
          }
        }
      }

      document.querySelectorAll('.ticket-item').forEach(function(i) { i.classList.remove('selected'); });
      item.classList.add('selected');

      var timeText = item.querySelector('.ticket-time');
      var priceText = item.querySelector('.ticket-price');
      var horario = timeText ? timeText.textContent.trim() : '';
      var precios = priceText ? priceText.textContent.trim() : '';
      var fechaTexto = document.getElementById('cal-date-text') ? document.getElementById('cal-date-text').textContent : '';

      var confirmTitle = document.getElementById('modal-confirm-title');
      var tblFecha = document.getElementById('modal-tbl-fecha');
      var tblHorario = document.getElementById('modal-tbl-horario');
      var tblNino = document.getElementById('modal-tbl-nino');
      var tblAdulto = document.getElementById('modal-tbl-adulto');
      var confirmOverlay = document.getElementById('modal-confirm-overlay');

      if (confirmTitle) confirmTitle.textContent = fechaTexto + ',  ' + horario;
      if (tblFecha) tblFecha.textContent = fechaTexto;
      if (tblHorario) tblHorario.textContent = horario;

      var preciosParts = precios.split('·');
      if (tblNino) tblNino.textContent = preciosParts[1] ? preciosParts[1].trim() : precios;
      if (tblAdulto) tblAdulto.textContent = preciosParts[0] ? preciosParts[0].trim() : precios;
      if (confirmOverlay) confirmOverlay.removeAttribute('hidden');
    });
  });
})();

// --- 7. Contadores y Stripe ---
(function() {
  var PRECIO = 12.95;

  function actualizarTotal() {
    var adultos = parseInt(document.getElementById('adultos-val').textContent) || 0;
    var ninos = parseInt(document.getElementById('ninos-val').textContent) || 0;
    var total = (adultos + ninos) * PRECIO;
    var totalEl = document.getElementById('pf-total');
    if (totalEl) totalEl.textContent = '£ ' + total.toFixed(2);
  }

  function makeCounter(minusId, plusId, valId) {
    var val = 0;
    var minus = document.getElementById(minusId);
    var plus = document.getElementById(plusId);
    var display = document.getElementById(valId);
    if (!minus || !plus || !display) return;
    minus.addEventListener('click', function() {
      if (val > 0) { val--; display.textContent = val; actualizarTotal(); }
    });
    plus.addEventListener('click', function() {
      if (val < 20) { val++; display.textContent = val; actualizarTotal(); }
    });
  }

  makeCounter('adultos-minus', 'adultos-plus', 'adultos-val');
  makeCounter('ninos-minus', 'ninos-plus', 'ninos-val');
})();

(function() {
  var stripe = Stripe('pk_test_51TQkbiE39Wjlxm9UGglTWob41ovCU8qN42gwfHuJQNscpD8pkif2P0xhJExiUgWZFYKHYHxP2FlV4AAFXqaEJxmo00gOIQKJJM');
  var elements = stripe.elements({ fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Segoe+UI' }] });

  var style = {
    base: { fontSize: '15px', color: '#1a1a1a', fontFamily: '"Segoe UI", system-ui, sans-serif', '::placeholder': { color: '#888' } },
    invalid: { color: '#d32f2f' }
  };

  var cardNumber = elements.create('cardNumber', { style: style, showIcon: true, disableLink: true });
  var cardExpiry = elements.create('cardExpiry', { style: style });
  var cardCvc = elements.create('cardCvc', { style: style, placeholder: '000' });

  cardNumber.mount('#stripe-card-number');
  cardExpiry.mount('#stripe-card-expiry');
  cardCvc.mount('#stripe-card-cvc');

  cardNumber.on('change', function(e) {
    var err = document.getElementById('err-tarjeta');
    var msg = document.getElementById('err-tarjeta-msg');
    if (e.error) { msg.textContent = e.error.message; err.removeAttribute('hidden'); }
    else { err.setAttribute('hidden', ''); }
  });

  cardExpiry.on('change', function(e) {
    var err = document.getElementById('err-vencimiento');
    e.error ? err.removeAttribute('hidden') : err.setAttribute('hidden', '');
  });

  cardCvc.on('change', function(e) {
    var err = document.getElementById('err-cvv');
    e.error ? err.removeAttribute('hidden') : err.setAttribute('hidden', '');
  });

  var successOverlay = document.getElementById('modal-success-overlay');
  var successClose = document.getElementById('modal-success-close');
  if (successClose) { successClose.addEventListener('click', function() { successOverlay.setAttribute('hidden', ''); }); }
  
  var failedOverlay = document.getElementById('modal-failed-overlay');
  var failedClose = document.getElementById('modal-failed-close');
  if (failedClose) { failedClose.addEventListener('click', function() { failedOverlay.setAttribute('hidden', ''); }); }

  var btn = document.getElementById('btn-compra');
  if (!btn) return;

  btn.addEventListener('click', function() {
    var valid = true;
    function showErr(errId, inputId) {
      var err = document.getElementById(errId);
      var inp = inputId ? document.getElementById(inputId) : null;
      if (err) err.removeAttribute('hidden');
      if (inp) inp.classList.add('input-error');
      valid = false;
    }
    function hideErr(errId, inputId) {
      var err = document.getElementById(errId);
      var inp = inputId ? document.getElementById(inputId) : null;
      if (err) err.setAttribute('hidden', '');
      if (inp) inp.classList.remove('input-error');
    }

    var nombre = document.getElementById('pf-nombre').value.trim();
    nombre.length < 2 ? showErr('err-nombre', 'pf-nombre') : hideErr('err-nombre', 'pf-nombre');

    var apellido = document.getElementById('pf-apellido').value.trim();
    apellido.length < 2 ? showErr('err-apellido', 'pf-apellido') : hideErr('err-apellido', 'pf-apellido');

    var correo = document.getElementById('pf-correo').value.trim();
    var correoRegex = /^[^\s@]+@(gmail|outlook|hotmail|yahoo|icloud|live|protonmail|msn)\.(com|mx|es|net|org)$/i;
    correoRegex.test(correo) ? hideErr('err-correo', 'pf-correo') : showErr('err-correo', 'pf-correo');

    var adultos = parseInt(document.getElementById('adultos-val').textContent) || 0;
    var ninos = parseInt(document.getElementById('ninos-val').textContent) || 0;
    adultos + ninos === 0 ? showErr('err-boletos', null) : hideErr('err-boletos', null);

    if (!valid) return;

    btn.disabled = true;
    btn.textContent = 'Procesando…';

    var totalTexto = document.getElementById('pf-total').textContent;
    var totalNum = parseFloat(totalTexto.replace('£', '').trim());

    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
      billing_details: { name: nombre + ' ' + apellido, email: correo }
    }).then(function(result) {
      btn.disabled = false;
      btn.textContent = 'Efectuar Compra';

      if (result.error) {
        var failedMsg = document.getElementById('modal-failed-msg');
        failedMsg.textContent = result.error.message;
        failedOverlay.removeAttribute('hidden');
      } else {
        var last4 = result.paymentMethod.card.last4;
        var rechazadas = {
          '0002': 'Tu tarjeta fue rechazada.',
          '9995': 'Tu tarjeta no tiene fondos suficientes.',
          '0069': 'Tu tarjeta está expirada.',
          '0127': 'El CVV de tu tarjeta es incorrecto.',
          '9979': 'Tu tarjeta fue reportada como robada.'
        };

        if (rechazadas[last4]) {
          var failedMsg = document.getElementById('modal-failed-msg');
          failedMsg.textContent = rechazadas[last4];
          failedOverlay.removeAttribute('hidden');
        } else {
          var successMsg = document.getElementById('modal-success-msg');
          successMsg.textContent = '¡Pago realizado con éxito! Se han reservado ' + (adultos + ninos) + ' entradas por un total de £' + totalNum.toFixed(2) + '. Revisa la confirmación en tu correo.';
          successOverlay.removeAttribute('hidden');

          emailjs.send('service_fm3nkmj', 'template_ghjehj7', {
            nombre: nombre + ' ' + apellido,
            correo: correo,
            entradas: (adultos + ninos) + ' entrada(s) — Adultos: ' + adultos + ', Niños: ' + ninos,
            total: '£ ' + totalNum.toFixed(2)
          }).catch(function(err) { console.error('EmailJS error:', err); });
        }
      }
    });
  });
})();
