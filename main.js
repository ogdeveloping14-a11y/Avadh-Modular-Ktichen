document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".page-progress span");
  const menu = document.querySelector(".menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const toast = document.querySelector(".toast");

  // Scroll reveal
  const reveal = document.querySelectorAll(".reveal");
  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12}) : null;
  reveal.forEach(el => observer ? observer.observe(el) : el.classList.add("in"));

  // Header + reading progress
  const updateScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 15);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? Math.min(100, y / max * 100) : 0}%`;
  };
  updateScroll();
  window.addEventListener("scroll", updateScroll, {passive:true});

  // Mobile menu
  if (menu) {
    menu.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      mobileMenu.setAttribute("aria-hidden", String(!open));
    });
  }
  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menu?.setAttribute("aria-expanded","false");
  }));

  // Active navigation
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, {rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(s => navObserver.observe(s));

  // Hero image slider
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dots button")];
  let slideIndex = 0;
  const setSlide = i => {
    slideIndex = i % slides.length;
    slides.forEach((s,n) => s.classList.toggle("active", n === slideIndex));
    dots.forEach((d,n) => d.classList.toggle("active", n === slideIndex));
  };
  dots.forEach((d,i) => d.addEventListener("click", () => setSlide(i)));
  if (slides.length > 1) setInterval(() => setSlide(slideIndex + 1), 5500);

  // Lightbox
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox?.querySelector("img");
  document.querySelectorAll("[data-lightbox]").forEach(card => {
    card.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = card.dataset.lightbox;
      lightboxImg.alt = card.querySelector("img")?.alt || "Avdh project";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    });
  });
  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  };
  lightbox?.querySelector("button")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  // Friendly fallback while customer's number is not configured.
  document.querySelectorAll("[data-whatsapp-link], [data-call-link]").forEach(el => {
    el.addEventListener("click", e => {
      const configured = (typeof BUSINESS !== "undefined" && /^\d{10,15}$/.test((BUSINESS.PHONE_NUMBER || "").replace(/\D/g,"")));
      if (!configured && (el.hasAttribute("data-whatsapp-link") || el.hasAttribute("data-call-link"))) {
        if (el.getAttribute("href") === "#contact") {
          // Allow normal in-page navigation for the CTA.
          return;
        }
        e.preventDefault();
        toast.textContent = "WhatsApp / phone number is ready to add in js/config.js.";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }
    });
  });

  // Button micro-interaction
  document.querySelectorAll(".btn, .nav-whatsapp, .nav-call").forEach(btn => {
    btn.addEventListener("pointerdown", () => {
      btn.style.transform = "scale(.98)";
      setTimeout(() => btn.style.transform = "", 130);
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
