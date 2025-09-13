const hamburger = document.getElementById('hamburger');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMenu = document.getElementById('closeMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
const body = document.body;

// Open mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.add('active');
  mobileMenuOverlay.classList.add('active');
  body.classList.add('menu-open');
});

// Close mobile menu
closeMenu.addEventListener('click', closeMobileMenu);

// Close menu when clicking on a link
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking outside content
mobileMenuOverlay.addEventListener('click', (e) => {
  if (e.target === mobileMenuOverlay) {
    closeMobileMenu();
  }
});

// Close menu function
function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');
  body.classList.remove('menu-open');
}

// Close menu with escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
    closeMobileMenu();
  }
});