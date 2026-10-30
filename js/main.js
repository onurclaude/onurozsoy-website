(function () {
  const EN = {
    brandsub: "Web, Mobile & Digital Solutions", nav1: "Home", nav2: "Areas of Expertise", nav4: "NFC & QR", nav5: "About", nav6: "Contact",
    cta: "Get in Touch with Me", eyebrow: "Web Development & Digital Solutions",
    h1a: "Turning ideas", h1b: "into digital", h1c: "products.",
    hv1: "A measurable digital presence for your brand.", hv2: "Coffee", hv3: "Review us<br>on Google",
    sub: "Onur Özsoy designs and develops modern websites, digital menu systems and NFC/QR solutions. Not a template — an infrastructure built around the need.",
    cta1: "Get in Touch with Me", cta2: "Areas of Expertise",
    stat1: "Years of experience", stat2: "Projects developed",
    s_eyebrow: "Areas of Expertise", s_h2: "The whole digital side.",
    s_sub: "From websites to digital menus, NFC/QR products to software projects: I work across all stages of design, development and release.",
    sv1t: "Website Design & Development", sv1b: "Websites. Modern design, responsive development, speed and SEO-ready architecture.",
    sv1c1: "WEB INTERFACE", sv1c2: "LANDING PAGE", sv1c3: "PERFORMANCE & SEO",
    sv2t: "Restaurant & Café Digital Menu", sv2b: "Mobile-first menus opened by QR or NFC. Prices and items update in minutes.",
    sv3t: "NFC & QR Development", sv3b: "Redirect structures built on NFC tags and QR codes. One tap to the right page.",
    sv4t: "Digital Projects", sv4b: "Web applications, booking and ordering flows, dashboards and integrations.",
    sv4a: "Get in Touch with Me →",
    n_eyebrow: "NFC & QR products", n_h2: "One tap to the right place.",
    n_sub: "The phone is held to the card or the QR is scanned, and the chosen page opens in seconds. The destination can be changed later — no reprinting.",
    n_d1: "GOOGLE REVIEW", n_d2: "INSTAGRAM", n_d3: "DIGITAL MENU", n_d4: "WEBSITE", n_d5: "WHATSAPP", n_d6: "CUSTOM LINK",
    n_f1t: "Google Review card", n_f1b: "Counter-top, wallet size",
    n_f2t: "Table stand", n_f2b: "QR and NFC together",
    n_f3t: "Stickers & custom items", n_f3b: "Per use case",
    n_c1: "Review us<br>on Google", n_c2: "SCAN FOR MENU",
    m_eyebrow: "Digital menu", m_h2: "The menu lives on a phone, not in print.",
    m_sub: "A mobile-first digital menu that loads fast and can run on its own domain. A price change or a sold-out item can be updated in minutes.",
    m_l1: "Categories, sub-categories and multi-language support",
    m_l2: "Product photos, allergen and price fields",
    m_l3: "Used together with QR and NFC products",
    m_stand: "TABLE STAND",
    w_eyebrow: "Development approach", w_h2: "Four steps, a clear process.",
    w_sub: "A general software development methodology: from requirements analysis to release and maintenance.",
    w1t: "Discovery", w1b: "Analysis of the problem, audience and existing solutions. Scope becomes clear.",
    w2t: "Design", w2b: "No templates — an interface built for the product. Mobile and desktop designed together.",
    w3t: "Development", w3b: "Coded for speed, accessibility and SEO; testing and content entry included.",
    w4t: "Release & maintenance", w4b: "Domain, hosting and analytics setup, followed by updates and maintenance.",
    a_eyebrow: "About", a_role: "SOFTWARE DEVELOPER",
    a_h2: "I build digital products.",
    a_b1: "I'm a software developer working on the web side. My focus is corporate sites, digital menu systems and NFC/QR products, and I run the process myself from design to launch.",
    a_b2: "I prefer a small-scale, direct way of working: decisions happen fast and you communicate with the person building the product.",
    a_b3: "On the corporate side, I have worked on projects at Turkish Airlines, Turkcell, HAVELSAN, AGESA and Türksat.",
    a_p1t: "Custom design", a_p1b: "No off-the-shelf themes.",
    a_p2t: "Mobile first", a_p2b: "Most traffic comes from phones.",
    a_p3t: "Maintainability", a_p3b: "Maintenance and updates after release.",
    c_eyebrow: "Contact", c_h2: "Ask what you are curious about.",
    c_sub: "You can use the form for general questions, feedback and technical topics. No account or sign-up needed.",
    c_mail: "DIRECT EMAIL",
    f_name: "FULL NAME *", f_mail: "EMAIL *", f_subject: "SUBJECT",
    f_desc: "MESSAGE *", f_desc_ph: "Write your message.",
    f_send: "Send Message",
    brain_hint: "DRAG · ROTATE — CLICK · SCATTER",
    sv5t: "Mobile App & Game", sv5b: "Mobile apps and games for iOS and Android. End-to-end development, from the idea to the store release.",
    sv5c1: "MOBILE APP", sv5c2: "MOBILE GAME", sv5c3: "iOS & ANDROID",
    pl1: "Digital menu", pl2: "Mobile app", pl3: "Mobile game", pl4: "Website",
    mq: "<span>WEBSITE</span><span style='color: #B8994F;'>·</span><span>DIGITAL MENU</span><span style='color: #B8994F;'>·</span><span>NFC & QR DEVELOPMENT</span><span style='color: #B8994F;'>·</span><span>MOBILE APP</span><span style='color: #B8994F;'>·</span><span>WEB APPLICATION</span><span style='color: #B8994F;'>·</span>",
    ft_notice: "Notice: This website has been prepared to present a personal portfolio and technical work. No commercial services are offered through this site.",
    ft_sub: "ozsoyonur.com — Web, Mobile & Digital Solutions"
  };
  const MSG = {
    idle: { tr: "MESAJINIZI YAZIN", en: "WRITE YOUR MESSAGE" },
    sending: { tr: "GÖNDERİLİYOR…", en: "SENDING…" },
    sent: { tr: "TEŞEKKÜRLER — MESAJINIZ İLETİLDİ", en: "THANKS — YOUR MESSAGE HAS BEEN SENT" },
    error: { tr: "GÖNDERİLEMEDİ — LÜTFEN onur@ozsoyonur.com ADRESİNE YAZIN", en: "COULD NOT SEND — PLEASE EMAIL onur@ozsoyonur.com" }
  };

  EN.mq2 = EN.mq;

  const state = { lang: "tr", note: "idle" };

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
    formNote.textContent = MSG[state.note][lang];
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
    nav.style.background = on ? "rgba(0,0,0,.94)" : "rgba(0,0,0,0)";
    nav.style.backdropFilter = on ? "saturate(160%) blur(14px)" : "none";
    nav.style.borderBottomColor = on ? "rgba(255,255,255,.1)" : "rgba(255,255,255,0)";
    nav.style.color = "#ffffff";
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

  // the mock game's score ticks up while the showcase is on screen
  const gmScore = document.getElementById("gmScore");
  if (gmScore && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let score = 2480;
    setInterval(() => {
      if (document.hidden) return;
      score += 10;
      gmScore.textContent = score.toLocaleString("tr-TR").replace(".", " ");
    }, 400);
  }

  function setNote(key) {
    state.note = key;
    formNote.textContent = MSG[key][state.lang];
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (state.note === "sending") return;
    const submit = contactForm.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(contactForm).entries());
    setNote("sending");
    submit.disabled = true;
    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      contactForm.reset();
      setNote("sent");
    } catch (err) {
      setNote("error");
    } finally {
      submit.disabled = false;
    }
  });
})();
