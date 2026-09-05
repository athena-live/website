window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-MW9Z4L9WTY");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function revealMotionTargets() {
  // Content is visible by default, including without JavaScript or observer support.
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        observer.unobserve(target);
        if (prefersReducedMotion.matches) return;
        target.classList.add("is-entering");
        target.addEventListener("animationend", () => {
          target.classList.remove("is-entering");
        }, { once: true });
      });
    },
    { threshold: 0.05 }
  );

  // Animate individual blocks, never both a section and the cards inside it.
  document.querySelectorAll(".section-heading, .card, .contact-row").forEach((target) => {
    observer.observe(target);
  });

  prefersReducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    document.querySelectorAll(".is-entering").forEach((target) => {
      target.classList.remove("is-entering");
    });
  });
}

document.addEventListener("DOMContentLoaded", revealMotionTargets);
