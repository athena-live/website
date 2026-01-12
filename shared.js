(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      const isOpen = navbarCollapse.classList.toggle('is-open');
      navbarToggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const dropdown = toggle.closest('.dropdown');
      const isOpen = dropdown.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.dropdown.is-open').forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('is-open');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
})();
