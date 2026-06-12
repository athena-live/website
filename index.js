window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-MW9Z4L9WTY");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateCursorLight(event) {
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
}

function revealMotionTargets() {
  const targets = document.querySelectorAll(".section, .contact, .card");

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  targets.forEach((target, index) => {
    if (target.classList.contains("card")) {
      target.style.animationDelay = `${Math.min(index * 0.035, 0.28)}s`;
    }
    observer.observe(target);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  revealMotionTargets();

  if (!prefersReducedMotion.matches) {
    window.addEventListener("pointermove", updateCursorLight, { passive: true });
  }
});
