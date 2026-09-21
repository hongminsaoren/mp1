const nav = document.querySelector('.nav');
const links = Array.from(document.querySelectorAll('.nav-link'));
const sections = links.map((link) => document.querySelector(link.getAttribute('href')));

function updateNavigation() {
  nav.classList.toggle('small', window.scrollY > 20);
  const readingLine = window.scrollY + nav.getBoundingClientRect().height + 4;
  let current = 0;
  sections.forEach((section, index) => {
    if (section.offsetTop <= readingLine) current = index;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = links.length - 1;
  }
  links.forEach((link, index) => {
    link.classList.toggle('active', index === current);
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    updateNavigation();
    scheduled = false;
  });
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 64),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

const slides = Array.from(document.querySelectorAll('.slide'));
let currentSlide = 0;
function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
    slide.setAttribute('aria-hidden', String(i !== currentSlide));
  });
  document.querySelector('.slide-count').textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
}
document.querySelector('.prev').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('.next').addEventListener('click', () => showSlide(currentSlide + 1));

const topics = {
  ice: ['Sea ice', 'Sea ice forms from frozen ocean water. It grows in the dark winter and shrinks during summer. Animals use it to travel, rest, and hunt.'],
  seasons: ['Long seasons', 'Because of the tilt of Earth, the Arctic has very long summer days and winter nights. Daylight changes quickly during spring and fall.'],
  wildlife: ['Wildlife', 'Arctic animals handle the cold in different ways. Thick fur, layers of fat, and seasonal movement help them find food and shelter.']
};
const backdrop = document.querySelector('.modal-backdrop');
const closeButton = document.querySelector('.close');
let previousFocus;
function closeModal() {
  backdrop.hidden = true;
  document.body.classList.remove('modal-open');
  if (previousFocus) previousFocus.focus();
}
document.querySelectorAll('[data-topic]').forEach((button) => {
  button.addEventListener('click', () => {
    previousFocus = document.activeElement;
    const [title, text] = topics[button.dataset.topic];
    document.querySelector('#modal-title').textContent = title;
    document.querySelector('#modal-text').textContent = text;
    backdrop.hidden = false;
    document.body.classList.add('modal-open');
    closeButton.focus();
  });
});
closeButton.addEventListener('click', closeModal);
backdrop.addEventListener('click', (event) => {
  if (event.target === backdrop) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (backdrop.hidden) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'Tab') {
    event.preventDefault();
    closeButton.focus();
  }
});
