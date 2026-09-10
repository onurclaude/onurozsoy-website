(function () {
  const EN = {
    brandsub: "Web & Digital Solutions", nav1: "Home", nav2: "Services", nav3: "Projects", nav4: "NFC & QR", nav5: "About", nav6: "Contact",
    cta: "Get a Quote", eyebrow: "Web Development & Digital Solutions",
    h1a: "Take your business", h1b: "further", h1c: "in digital.",
    hv1: "A measurable digital presence for your brand.", hv2: "Coffee", hv3: "Review us<br>on Google",
    sub: "Onur Özsoy designs and develops modern websites, digital menu systems and NFC/QR solutions tailored to businesses. Not a template — an infrastructure built around your business.",
    cta1: "Let's Discuss Your Project", cta2: "View Work",
    stat1: "Years of experience", stat2: "Projects delivered", stat3: "Response time",
    s_eyebrow: "Services", s_h2: "The whole digital side, from one place.",
    s_sub: "From websites to digital menus, NFC/QR products to custom software: design, development and launch handled end to end.",
    sv1t: "Website Design & Development", sv1b: "Corporate, business and personal websites. Modern design, responsive development, speed and SEO-ready architecture.",
    sv1c1: "CORPORATE SITE", sv1c2: "LANDING PAGE", sv1c3: "PERFORMANCE & SEO",
    sv2t: "Restaurant & Café Digital Menu", sv2b: "Mobile-first menus opened by QR or NFC. Prices and items update in minutes.",
    sv3t: "NFC & QR Products", sv3b: "Google Review cards, table stands, stickers and custom products. One tap to the right page.",
    sv4t: "Custom Digital Projects", sv4b: "Business-specific web applications, booking and ordering flows, dashboards and integrations. We define the scope together.",
    sv4a: "Let's scope it →",
    p_eyebrow: "Selected projects", p_h2: "Different industries, one standard.", p_all: "All projects →",
    pj1k: "CORPORATE WEB", pj1b: "A product-led corporate site for a stationery and office supplies business: category structure, contact flow and fast mobile browsing.",
    pj_more: "CASE STUDY →",
    pj2k: "DIGITAL MENU", pj2t: "Café menu system", pj2b: "A mobile menu opened by QR; categories, campaigns and stock status editable by the business.",
    pj3k: "NFC / QR PRODUCT", pj3t: "Google Review set", pj3b: "NFC card and stand set for counter and table, sending customers straight to the business review page.",
    n_eyebrow: "NFC & QR products", n_h2: "One tap sends your customer to the right place.",
    n_sub: "The customer holds their phone to the card or scans the QR, and the page you chose opens in seconds. The destination can be changed later — no reprinting.",
    n_d1: "GOOGLE REVIEW", n_d2: "INSTAGRAM", n_d3: "DIGITAL MENU", n_d4: "WEBSITE", n_d5: "WHATSAPP", n_d6: "CUSTOM LINK",
    n_f1t: "Google Review card", n_f1b: "Counter-top, wallet size",
    n_f2t: "Table stand", n_f2b: "QR and NFC together",
    n_f3t: "Stickers & custom items", n_f3b: "Printed for your business",
    n_c1: "Review us<br>on Google", n_c2: "SCAN FOR MENU",
    m_eyebrow: "Digital menu", m_h2: "Your menu belongs on a phone, not in print.",
    m_sub: "A mobile-first menu that loads fast and runs on your own domain. A price change, a daily special or a sold-out item takes minutes.",
    m_l1: "Categories, sub-categories and multi-language support",
    m_l2: "Product photos, allergen and price fields",
    m_l3: "Delivered together with QR and NFC products",
    m_stand: "TABLE STAND",
    w_eyebrow: "How we work", w_h2: "Four steps, a clear delivery.",
    w_sub: "One person to talk to throughout: the owner and developer of the project.",
    w1t: "Discovery", w1b: "A quick read of the business, audience and competitors. Scope and budget get clear.",
    w2t: "Design", w2b: "No templates — an interface built for the brand. Mobile and desktop designed together.",
    w3t: "Development", w3b: "Coded for speed, accessibility and SEO; testing and content entry included.",
    w4t: "Launch & support", w4b: "Domain, hosting and analytics setup, then ongoing update support.",
    a_eyebrow: "About", a_role: "SOFTWARE DEVELOPER",
    a_h2: "I build digital products for businesses.",
    a_b1: "I'm a software developer working on the web side. My focus is corporate sites, digital menu systems and NFC/QR products, and I run the process myself from design to launch.",
    a_b2: "Instead of an agency structure I prefer direct contact: decisions happen fast and you speak with the person doing the work. After delivery the site stays yours, and I stay available for updates.",
    a_p1t: "Custom design", a_p1b: "No off-the-shelf themes.",
    a_p2t: "Mobile first", a_p2b: "Most traffic comes from phones.",
    a_p3t: "Long-term support", a_p3b: "Reachable after launch too.",
    c_eyebrow: "Contact", c_h2: "Tell me about your project and we'll plan it together.",
    c_sub: "Filling in the form is enough; I reply within 24 hours with scope, timing and a budget range. No account or sign-up needed.",
    c_mail: "DIRECT EMAIL",
    f_name: "FULL NAME *", f_mail: "EMAIL *", f_co: "COMPANY / BUSINESS", f_type: "PROJECT TYPE",
    f_desc: "PROJECT DESCRIPTION *", f_desc_ph: "Briefly describe what you want to build.",
    f_budget: "BUDGET RANGE (OPTIONAL)", f_send: "I'd Like to Discuss My Project",
    ft_sub: "onurozsoy.com — Web & Digital Solutions"
  };
  const NOTE = { tr: "YANIT SÜRESİ: 24 SAAT İÇİNDE", en: "RESPONSE TIME: WITHIN 24 HOURS" };
  const SENT = { tr: "TEŞEKKÜRLER — E-POSTA İSTEMCİNİZ AÇILIYOR", en: "THANKS — OPENING YOUR EMAIL CLIENT" };

  const state = { lang: "tr", sent: false };

  const nav = document.getElementById("siteNav");
  const navBar = nav.querySelector("nav");
  const drawer = document.getElementById("mobileDrawer");
  const burgerBtn = document.getElementById("burgerBtn");
  const langToggle = document.getElementById("langToggle");
  const langLabel = document.getElementById("langLabel");
  const formNote = document.getElementById("formNote");
  const contactForm = document.getElementById("contactForm");

  function applyLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (!el.dataset.trOrig) el.dataset.trOrig = el.innerHTML;
      el.innerHTML = lang === "en" && EN[k] ? EN[k] : el.dataset.trOrig;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const k = el.getAttribute("data-i18n-ph");
      if (!el.dataset.phOrig) el.dataset.phOrig = el.getAttribute("placeholder") || "";
      el.setAttribute("placeholder", lang === "en" && EN[k] ? EN[k] : el.dataset.phOrig);
    });
    document.documentElement.lang = lang;
    langLabel.textContent = lang === "tr" ? "EN" : "TR";
    formNote.textContent = state.sent ? SENT[lang] : NOTE[lang];
  }

  langToggle.addEventListener("click", () => {
    state.lang = state.lang === "tr" ? "en" : "tr";
    applyLang(state.lang);
  });

  burgerBtn.addEventListener("click", () => {
    drawer.style.display = drawer.style.display === "block" ? "none" : "block";
  });

  drawer.addEventListener("click", (e) => {
    if (e.target.tagName === "A") drawer.style.display = "none";
  });

  // The header is transparent until scrolled, so it must visually overlap
  // the dark hero section beneath it (sticky headers don't overlap at rest).
  function fixHeaderOverlap() {
    nav.style.marginBottom = -navBar.getBoundingClientRect().height + "px";
  }
  fixHeaderOverlap();
  window.addEventListener("resize", fixHeaderOverlap);

  function onScroll() {
    const on = window.scrollY > 24;
    nav.style.background = on ? "rgba(247,244,239,.88)" : "rgba(247,244,239,0)";
    nav.style.backdropFilter = on ? "saturate(160%) blur(14px)" : "none";
    nav.style.borderBottomColor = on ? "rgba(20,20,15,.1)" : "rgba(20,20,15,0)";
    nav.style.color = on ? "#14140F" : "#F2EFE8";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "";
          entry.target.classList.add("oz-rev");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "-8% 0px -12%" });
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.9) el.style.opacity = "0";
        io.observe(el);
      });
    });
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const lang = state.lang;
    const L = lang === "tr"
      ? { s: "Proje talebi", co: "Firma", t: "Proje türü", b: "Bütçe", d: "Açıklama", n: "Ad" }
      : { s: "Project inquiry", co: "Company", t: "Project type", b: "Budget", d: "Brief", n: "Name" };
    const body = [
      L.n + ": " + (f.get("name") || ""),
      "E-mail: " + (f.get("email") || ""),
      L.co + ": " + (f.get("company") || "—"),
      L.t + ": " + (f.get("type") || ""),
      L.b + ": " + (f.get("budget") || ""),
      "",
      L.d + ":",
      f.get("brief") || ""
    ].join("\n");
    state.sent = true;
    formNote.textContent = SENT[lang];
    window.location.href = "mailto:portofiskirtasiye@gmail.com?subject=" +
      encodeURIComponent(L.s + " — " + (f.get("name") || "")) + "&body=" + encodeURIComponent(body);
  });
})();
