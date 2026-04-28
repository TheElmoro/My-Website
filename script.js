// ----------------------
// DARK / LIGHT MODE
// ----------------------
const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
    themeBtn.onclick = function () {
        document.body.classList.toggle("light-mode");
    };
}

// ----------------------
// OBSERVER FOR REVEAL & COUNTER (Professional Way)
// ----------------------
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // اگر سکشن بود -> نمایش بده
            if (entry.target.tagName === "SECTION") {
                entry.target.classList.add("show");
            }
            // اگر کانتر بود -> شروع شمارش
            if (entry.target.classList.contains("counter")) {
                startCounter(entry.target);
            }
        }
    });
}, observerOptions);

// اعمال Observer روی سکشن‌ها
document.querySelectorAll("section").forEach(sec => observer.observe(sec));

// اعمال Observer روی اعداد
document.querySelectorAll(".counter").forEach(count => observer.observe(count));

function startCounter(counter) {
    const target = +counter.dataset.target;
    const update = () => {
        const current = +counter.innerText;
        const increment = target / 50;
        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }
    };
    update();
}

// ----------------------
// PRELOADER
// ----------------------
window.addEventListener("load", () => {
    const loader = document.getElementById("preloader");
    if (loader) loader.classList.add("hide");
});

// ----------------------
// SCROLL PROGRESS BAR
// ----------------------
window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) progressBar.style.width = `${progress}%`;
});

// ----------------------
// TYPING ANIMATION
// ----------------------
const text = "Hi, My name is Sina";
let index = 0;
const typingEl = document.getElementById("typing");

function type() {
    if (typingEl && index < text.length) {
        typingEl.textContent += text.charAt(index);
        index++;
        setTimeout(type, 80);
    }
}
type();

// ----------------------
// PARTICLES
// ----------------------
if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "window", // خیلی مهم: تعامل روی کل پنجره فعال باشه
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse" // باعث فرار کردن ذرات میشه
                },
                onclick: {
                    enable: true,
                    mode: "push" // با کلیک، ذره جدید اضافه می‌کنه
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 70, // شعاع فرار ذرات
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ----------------------
// 3D Tilt Hover
// ----------------------
const cards = document.querySelectorAll(".project-card");
cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 20;
        const rotateX = ((y / rect.height) - 0.5) * -20;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0)";
    });
});

// ----------------------
// Parallax Scroll
// ----------------------
window.addEventListener("scroll", () => {
    const scroll = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero) {
        hero.style.transform = `translateY(${scroll * 0.3}px)`;
    }
});

// ----------------------
// Animated Cursor
// ----------------------
const cursor = document.querySelector(".cursor");
if (cursor) {
    document.addEventListener("mousemove", e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}