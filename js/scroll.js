(function () {
  const scrolls = Array.from(document.querySelectorAll("[data-scroll]"));
  const pars = Array.from(document.querySelectorAll("[data-par]"));
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scrolls.forEach((el) => el.style.setProperty("--p", ".5"));
    return;
  }

  let queued = false;

  function update() {
    queued = false;
    const vh = window.innerHeight;
    scrolls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty("--p", p.toFixed(3));
    });
    pars.forEach((el) => {
      // measure the parent: the sticker's own transform would feed back into its rect
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty("--py", (c * parseFloat(el.dataset.par)).toFixed(1) + "px");
    });
  }

  function request() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
})();
