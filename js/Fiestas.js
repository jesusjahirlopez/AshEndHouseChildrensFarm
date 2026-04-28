/* ============================================
   Ash End House — Fiestas.js
   ============================================ */
(function () {
    "use strict";

    /* --- 1. Ano en footer --- */
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());

    /* --- 2. Navegacion y Menu Hamburguesa --- */
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("nav-toggle");
    var menu   = document.getElementById("nav-menu");

    if (header && toggle && menu) {
        var mq           = window.matchMedia("(min-width: 901px)");
        var infoToggle   = document.getElementById("nav-info-toggle");
        var infoSubmenu  = document.getElementById("nav-info-submenu");
        var infoDropdown = infoToggle && infoToggle.closest(".nav-dropdown");

        function setOpen(open) {
            header.classList.toggle("nav-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
            document.body.classList.toggle("nav-menu-open", open);
        }

        function setInfoDropdownOpen(open) {
            if (!infoDropdown || !infoToggle || !infoSubmenu) return;
            infoDropdown.classList.toggle("is-open", open);
            infoToggle.setAttribute("aria-expanded", open ? "true" : "false");
            if (open) { infoSubmenu.removeAttribute("hidden"); }
            else      { infoSubmenu.setAttribute("hidden", ""); }
        }

        toggle.addEventListener("click", function () {
            var opening = !header.classList.contains("nav-open");
            setOpen(opening);
            if (!opening) setInfoDropdownOpen(false);
        });

        if (infoToggle && infoDropdown) {
            infoToggle.addEventListener("click", function (e) {
                e.stopPropagation();
                setInfoDropdownOpen(!infoDropdown.classList.contains("is-open"));
            });
        }

        document.addEventListener("click", function (e) {
            if (infoDropdown && infoDropdown.classList.contains("is-open") && !infoDropdown.contains(e.target)) {
                setInfoDropdownOpen(false);
            }
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setInfoDropdownOpen(false);
                if (!mq.matches) setOpen(false);
            });
        });

        document.addEventListener("keydown", function (e) {
            if (e.key !== "Escape") return;
            if (infoDropdown && infoDropdown.classList.contains("is-open")) {
                setInfoDropdownOpen(false);
                return;
            }
            setOpen(false);
        });

        mq.addEventListener("change", function (e) {
            if (e.matches) { setOpen(false); setInfoDropdownOpen(false); }
        });
    }

    /* --- 3. Modo oscuro --- */
    var darkBtn = document.getElementById("btn-dark-mode");
    if (darkBtn) {
        darkBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            var isDark = document.body.classList.contains("dark-mode");
            darkBtn.setAttribute("title", isDark ? "Desactivar modo oscuro" : "Activar modo oscuro");
            darkBtn.setAttribute("aria-label", isDark ? "Desactivar modo oscuro" : "Activar modo oscuro");
        });
    }

    /* --- 4. Tamano de fuente --- */
    var fontBtn = document.getElementById("btn-font-size");
    if (fontBtn) {
        var sizes = ["", "font-md", "font-lg"];
        var labels = ["normal", "mediano", "grande"];
        var idx = 0;
        fontBtn.addEventListener("click", function () {
            document.body.classList.remove(sizes[idx]);
            idx = (idx + 1) % sizes.length;
            if (sizes[idx]) document.body.classList.add(sizes[idx]);
            fontBtn.setAttribute("aria-label", "Tamaño de texto " + labels[idx]);
            fontBtn.setAttribute("title", "Tamaño de texto: " + labels[idx]);
        });
    }

})();
