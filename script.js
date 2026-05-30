document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const finePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

  const allowPointerEffects = finePointer && !coarsePointer && !prefersReducedMotion;

  // --- FX staging helpers
  const afterNextPaint = (cb) => {
    requestAnimationFrame(() => requestAnimationFrame(cb));
  };

  const runWhenIdle = (cb, timeout = 1200) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => cb(), { timeout });
    } else {
      setTimeout(cb, Math.min(350, timeout));
    }
  };

  /* ---------------------------
   * Theme
   * --------------------------- */
  const themeBtn = document.getElementById("theme-toggle");
  const mobileThemeBtn = document.getElementById("mobileThemeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") body.classList.add("light-mode");

  const toggleTheme = () => {
    body.classList.toggle("light-mode");
    localStorage.setItem(
      "theme",
      body.classList.contains("light-mode") ? "light" : "dark"
    );
  };

  themeBtn?.addEventListener("click", toggleTheme);
  mobileThemeBtn?.addEventListener("click", toggleTheme);

  /* ---------------------------
   * Preloader
   * --------------------------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener(
    "load",
    () => {
      body.classList.add("page-loaded");
      preloader?.classList.add("hide");
    },
    { once: true }
  );

  /* ---------------------------
   * Reveal sections
   * --------------------------- */
  const revealSections = document.querySelectorAll("main section");

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealSections.forEach((section) => revealObserver.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("show"));
  }

  /* ---------------------------
   * Typing effect
   * --------------------------- */
  const typingEl = document.getElementById("typing");
  if (typingEl) {
    const text = "Hi, My name is Sina";
    if (prefersReducedMotion) {
      typingEl.textContent = text;
    } else {
      let i = 0;
      const tick = () => {
        typingEl.textContent = text.slice(0, i++);
        if (i <= text.length) setTimeout(tick, 90);
      };
      tick();
    }
  }

  /* ---------------------------
   * FX staging: enable heavy effects AFTER first paint
   * --------------------------- */
  afterNextPaint(() => {
    body.classList.remove("fx-pending");
    body.classList.add("fx-ready");
  });

  /* ---------------------------
   * Particles (deferred / disabled on weak contexts)
   * --------------------------- */
  const particlesHost = document.getElementById("particles-js");
  const isSmallScreen =
    window.matchMedia?.("(max-width: 768px)")?.matches ?? false;

  const initParticles = () => {
    if (
      particlesHost &&
      !prefersReducedMotion &&
      typeof particlesJS !== "undefined" &&
      !isSmallScreen
    ) {
      particlesJS("particles-js", {
        particles: {
          number: {
            value: allowPointerEffects ? 50 : 28,
            density: { enable: true, value_area: 900 },
          },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.45, random: false },
          size: { value: 2.6, random: true },
          line_linked: {
            enable: true,
            distance: 160,
            color: "#ffffff",
            opacity: 0.25,
            width: 1,
          },
          move: {
            enable: true,
            speed: allowPointerEffects ? 1.6 : 1.0,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: allowPointerEffects, mode: "repulse" },
            onclick: { enable: allowPointerEffects, mode: "push" },
          },
          modes: {
            repulse: { distance: 110 },
            push: { particles_nb: 3 },
          },
        },
        retina_detect: true,
      });
    } else if (particlesHost) {
      particlesHost.style.display = "none";
    }
  };

  runWhenIdle(initParticles);

  /* ---------------------------
   * Custom Cursor (REMOVED)
   * --------------------------- */
  // Intentionally removed per request (no cursor element, no mousemove listener, no rAF loop)

  /* ---------------------------
   * Mobile Menu
   * --------------------------- */
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  let lastMenuFocus = null;

  const getFocusable = (container) => {
    if (!container) return [];
    return [
      ...container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      ),
    ].filter(
      (el) =>
        !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
    );
  };

  const trapFocusInside = (container, e) => {
    if (!container || e.key !== "Tab") return;
    const focusable = getFocusable(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const isMenuOpen = () => !!mobileMenu?.classList.contains("open");

  const openMenu = () => {
    if (!mobileMenu) return;
    lastMenuFocus = document.activeElement;

    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");

    mobileMenuToggle?.setAttribute("aria-expanded", "true");
    mobileMenuToggle?.setAttribute("aria-label", "Close menu");

    const focusable = getFocusable(mobileMenu);
    if (focusable.length) setTimeout(() => focusable[0].focus(), 10);
  };

  const closeMenu = () => {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");

    mobileMenuToggle?.setAttribute("aria-expanded", "false");
    mobileMenuToggle?.setAttribute("aria-label", "Open menu");

    if (lastMenuFocus?.focus) lastMenuFocus.focus();
  };

  mobileMenuToggle?.addEventListener("click", () =>
    isMenuOpen() ? closeMenu() : openMenu()
  );
  mobileMenuClose?.addEventListener("click", closeMenu);

  mobileMenu?.addEventListener("click", (e) => {
    if (e.target?.matches?.("[data-close-menu]")) closeMenu();
  });

  mobileNavLinks.forEach((link) => link.addEventListener("click", closeMenu));

  /* ---------------------------
   * Stats Counter
   * --------------------------- */
  const statsSection = document.getElementById("stats");
  const counters = document.querySelectorAll(".counter");
  let counted = false;

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target || "0", 10);

      if (prefersReducedMotion) {
        counter.textContent = String(target);
        return;
      }

      let current = 0;
      const step = Math.max(1, Math.floor(target / 80));

      const update = () => {
        current += step;
        if (current >= target) current = target;
        counter.textContent = String(current);
        if (current < target) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  if (statsSection && counters.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        if (!counted && entries[0]?.isIntersecting) {
          counted = true;
          runCounters();
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    statsObserver.observe(statsSection);
  } else {
    runCounters();
  }

  /* ---------------------------
   * Skill bars (OPTIMIZED: class-based trigger + CSS-driven transform; staggered)
   * --------------------------- */
  const skillFills = Array.from(document.querySelectorAll(".skill-fill"));

  const applySkillValue = (el) => {
    const v = Math.max(0, Math.min(100, Number(el.dataset.skill) || 0));
    // expose progress to CSS without JS animating per-frame
    el.style.setProperty("--skill", String(v));
    el.style.width = `${v}%`; // harmless fallback if any legacy CSS still uses width
  };

  if (skillFills.length) {
    skillFills.forEach((el) => {
      applySkillValue(el);
      el.classList.remove("in-view");
    });

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const skillObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const idx = skillFills.indexOf(el);
            const delay = idx >= 0 ? idx * 90 : 0;

            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("in-view");

            obs.unobserve(el);
          });
        },
        { threshold: 0.35 }
      );

      skillFills.forEach((el) => skillObserver.observe(el));
    } else {
      skillFills.forEach((el) => el.classList.add("in-view"));
    }
  }

  /* ---------------------------
   * Filter Projects
   * --------------------------- */
  const filterBtns = document.querySelectorAll(".portfolio-filter button");
  const cards = document.querySelectorAll(".project-card");

  const normalizeCategory = (value = "") => value.trim().toLowerCase();

  const applyFilter = (filter) => {
    cards.forEach((card) => {
      const category = normalizeCategory(card.dataset.category || "");
      const shouldShow = filter === "all" ? true : category === filter;
      card.classList.toggle("hide", !shouldShow);
      card.classList.toggle("show", shouldShow);
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = normalizeCategory(btn.dataset.filter || "all");
      applyFilter(filter);
    });
  });

  /* ---------------------------
   * Project data (KEEP AS-IS in your real file)
   * --------------------------- */
  const projectsData = [/* ... keep your array as-is ... */];

  /* ---------------------------
   * Modal
   * --------------------------- */
  const modal = document.getElementById("projectModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalTitle = document.getElementById("projectModalTitle");
  const modalCategory = document.getElementById("projectModalCategory");
  const modalStatus = document.getElementById("projectModalStatus");
  const modalDescription = document.getElementById("projectModalDescription");
  const modalYear = document.getElementById("projectModalYear");
  const modalTech = document.getElementById("projectModalTech");
  const modalFeatures = document.getElementById("projectModalFeatures");
  const modalLive = document.getElementById("projectModalLive");
  const modalGithub = document.getElementById("projectModalGithub");

  let lastFocusedEl = null;

  const getStatusClass = (statusText = "") => {
    const normalized = statusText.trim().toLowerCase();
    if (normalized === "completed") return "completed";
    if (normalized === "in progress") return "in-progress";
    return "concept";
  };

  const isModalOpen = () => !!modal?.classList.contains("open");

  const openModal = (projectId) => {
    if (!modal) return;

    const project = projectsData.find((item) => String(item.id) === String(projectId));
    if (!project) return;

    lastFocusedEl = document.activeElement;

    modalTitle.textContent = project.title ?? "";
    modalCategory.textContent = project.category ?? "";
    modalDescription.textContent = project.description ?? "";
    modalYear.textContent = project.year ?? "";

    modalStatus.textContent = project.status ?? "";
    modalStatus.className = `project-status ${getStatusClass(project.status || "")}`;

    modalTech.innerHTML = (project.tech || [])
      .map((t) => `<span class="tech-chip">${t}</span>`)
      .join("");
    modalFeatures.innerHTML = (project.features || []).map((f) => `<li>${f}</li>`).join("");

    if (modalLive) {
      modalLive.href = project.live || "#";
      modalLive.toggleAttribute("aria-disabled", !project.live);
      modalLive.tabIndex = project.live ? 0 : -1;
    }

    if (modalGithub) {
      modalGithub.href = project.github || "#";
      modalGithub.toggleAttribute("aria-disabled", !project.github);
      modalGithub.tabIndex = project.github ? 0 : -1;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    setTimeout(() => modalCloseBtn?.focus(), 10);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    lastFocusedEl?.focus?.();
  };

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const target = e.target;
      if (target && (target.closest("a") || target.closest("button"))) return;
      openModal(card.dataset.projectId);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.projectId);
      }
    });
  });

  modalCloseBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target?.matches?.("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isModalOpen()) closeModal();
      if (isMenuOpen()) closeMenu();
    }
    if (isModalOpen()) trapFocusInside(modal, e);
    if (isMenuOpen()) trapFocusInside(mobileMenu, e);
  });

  /* ---------------------------
   * Tilt effect (optimized with rAF + rect cache)
   * --------------------------- */
  const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

  if (allowPointerEffects) {
    cards.forEach((card) => {
      const inner = card.querySelector(".project-inner");
      if (!inner) return;

      const maxTilt = 10;
      const z = 18;

      let rect = null;
      let latestEvent = null;
      let rafId = null;

      const update = () => {
        rafId = null;
        if (!rect || !latestEvent) return;

        const e = latestEvent;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const px = (x / rect.width) * 2 - 1;
        const py = (y / rect.height) * 2 - 1;

        const rotateY = clamp(px * maxTilt, -maxTilt, maxTilt);
        const rotateX = clamp(-py * maxTilt, -maxTilt, maxTilt);

        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${z}px)`;

        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      };

      card.addEventListener("mouseenter", () => {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener(
        "mousemove",
        (e) => {
          if (!rect) rect = card.getBoundingClientRect();
          latestEvent = e;
          if (rafId) return;
          rafId = requestAnimationFrame(update);
        },
        { passive: true }
      );

      card.addEventListener("mouseleave", () => {
        rect = null;
        latestEvent = null;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        inner.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
      });
    });
  }

  /* ---------------------------
   * Magnetic Buttons (optimized with rAF)
   * --------------------------- */
  const magneticButtons = document.querySelectorAll(".magnetic-btn");

  if (allowPointerEffects && magneticButtons.length) {
    magneticButtons.forEach((btn) => {
      let rect = null;
      let latestEvent = null;
      let rafId = null;

      const update = () => {
        rafId = null;
        if (!rect || !latestEvent) return;

        const e = latestEvent;
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      };

      btn.addEventListener("mouseenter", () => {
        rect = btn.getBoundingClientRect();
      });

      btn.addEventListener(
        "mousemove",
        (e) => {
          if (!rect) rect = btn.getBoundingClientRect();
          latestEvent = e;
          if (rafId) return;
          rafId = requestAnimationFrame(update);
        },
        { passive: true }
      );

      btn.addEventListener("mouseleave", () => {
        rect = null;
        latestEvent = null;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------------------------
   * Active nav + Scroll progress
   * --------------------------- */
  const hero = document.querySelector(".hero");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const sections = Array.from(document.querySelectorAll("#home, main section"));
  const scrollProgressBtn = document.getElementById("scrollProgress");
  const progressRing = document.querySelector("#scrollProgress .progress-ring");

  let circumference = 0;
  if (progressRing) {
    const radius = progressRing.r.baseVal.value;
    circumference = 2 * Math.PI * radius;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = `${circumference}`;
  }

  let sectionRanges = [];
  const computeSectionRanges = () => {
    const offset = 140;
    sectionRanges = sections
      .filter((sec) => sec && sec.id)
      .map((sec) => {
        const top = sec.offsetTop - offset;
        const bottom = top + sec.offsetHeight;
        return { id: sec.id, top, bottom };
      });
  };

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeSectionRanges();
      requestAnimationFrame(onScroll);
    }, 120);
  };

  const setActiveNavByY = (scrollY) => {
    let currentId = "home";
    for (const r of sectionRanges) {
      if (scrollY >= r.top && scrollY < r.bottom) {
        currentId = r.id;
        break;
      }
    }
    [...navLinks, ...mobileLinks].forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;

    if (hero && allowPointerEffects && !isSmallScreen && y < 700) {
      hero.style.transform = `translateY(${y * 0.03}px)`;
    } else if (hero) {
      hero.style.transform = "";
    }

    setActiveNavByY(y);

    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const progress = maxScroll > 0 ? y / maxScroll : 0;

    if (progressRing) {
      progressRing.style.strokeDashoffset = String(
        circumference - progress * circumference
      );
    }

    scrollProgressBtn?.classList.toggle("show", y > 250);

    ticking = false;
  };

  scrollProgressBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  computeSectionRanges();
  window.addEventListener("resize", onResize, { passive: true });

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );

  requestAnimationFrame(onScroll);
});