"use strict";

/* =====================================================
   EYL — FINAL WEBSITE SCRIPT
   Version: 1.0 / Website Freeze
===================================================== */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =====================================================
   GLOBAL STATE
===================================================== */

const supportsHover =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const isMobile =
    window.matchMedia("(max-width: 600px)").matches;


/* =====================================================
   LOADER
===================================================== */

const loader = $("#loader");

function hideLoader() {
    if (!loader) return;

    loader.classList.add("done");

    setTimeout(() => {
        loader.style.pointerEvents = "none";
    }, 700);
}

if (loader) {
    setTimeout(hideLoader, 900);

    window.addEventListener("load", () => {
        setTimeout(hideLoader, 250);
    });
}


/* =====================================================
   NAVBAR
===================================================== */

const navbar = $(".navbar");

function updateNavbar() {
    if (!navbar) return;

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

updateNavbar();

window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
);


/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton = $("#menuButton");
const mobileNav = $("#mobileNav");

function closeMenu() {
    if (!menuButton || !mobileNav) return;

    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");

    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");

    document.body.classList.remove("menu-open");
}

function openMenu() {
    if (!menuButton || !mobileNav) return;

    menuButton.classList.add("active");
    menuButton.setAttribute("aria-expanded", "true");

    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");

    document.body.classList.add("menu-open");
}

if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
        const isOpen =
            mobileNav.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

$$(".mobile-nav a").forEach(link => {
    link.addEventListener("click", closeMenu);
});


/* =====================================================
   SMOOTH ANCHOR NAVIGATION
===================================================== */

$$("a[href^='#']").forEach(link => {

    link.addEventListener("click", event => {

        const href =
            link.getAttribute("href");

        if (!href || href === "#") return;

        const target =
            document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        closeMenu();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    closeMenu();
    closeModal();
    closeSecret();

});


/* =====================================================
   REVEAL ANIMATIONS
===================================================== */

const revealElements =
    $$(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    $$("main section[id]");

const navigationLinks =
    $$(".desktop-nav a, .mobile-nav a");

if ("IntersectionObserver" in window) {

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const id =
                        entry.target.id;

                    navigationLinks.forEach(link => {

                        const href =
                            link.getAttribute("href");

                        link.classList.toggle(
                            "active",
                            href === `#${id}`
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

}


/* =====================================================
   STORY CARDS
===================================================== */

const storyCards =
    $$(".story-card");

storyCards.forEach(card => {

    card.addEventListener("click", () => {

        storyCards.forEach(item => {
            item.classList.remove("active");
        });

        card.classList.add("active");

    });

    if (supportsHover) {

        card.addEventListener(
            "mouseenter",
            () => {
                card.style.setProperty(
                    "--card-glow",
                    "1"
                );
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {
                card.style.removeProperty(
                    "--card-glow"
                );
            }
        );

    }

});


/* =====================================================
   HERO PARALLAX
===================================================== */

const hero =
    $(".hero");

const heroBackground =
    $(".hero-background-image");

const heroOrb =
    $(".hero-orb");

const cursorGlow =
    $(".cursor-glow");

if (
    supportsHover &&
    hero &&
    heroBackground
) {

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationRunning = false;

    const animateHero = () => {

        currentX +=
            (mouseX - currentX) * 0.04;

        currentY +=
            (mouseY - currentY) * 0.04;

        heroBackground.style.transform =
            `scale(1.04)
             translate(${currentX * -7}px,
                       ${currentY * -5}px)`;

        if (heroOrb) {

            heroOrb.style.transform =
                `translate(${currentX * 18}px,
                           ${currentY * 14}px)`;

        }

        if (
            Math.abs(mouseX - currentX) > 0.01 ||
            Math.abs(mouseY - currentY) > 0.01
        ) {

            requestAnimationFrame(
                animateHero
            );

        } else {

            animationRunning = false;

        }

    };


    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX /
                window.innerWidth - 0.5;

            mouseY =
                event.clientY /
                window.innerHeight - 0.5;


            if (cursorGlow) {

                cursorGlow.style.opacity = "1";

                cursorGlow.style.left =
                    `${event.clientX}px`;

                cursorGlow.style.top =
                    `${event.clientY}px`;

            }


            if (!animationRunning) {

                animationRunning = true;

                requestAnimationFrame(
                    animateHero
                );

            }

        },
        { passive: true }
    );

}


/* =====================================================
   NIGHT PARALLAX
===================================================== */

const night =
    $(".night");

const nightBackground =
    $(".night-background-image");

if (
    supportsHover &&
    night &&
    nightBackground
) {

    let ticking = false;

    const updateNight = () => {

        ticking = false;

        const rect =
            night.getBoundingClientRect();

        const viewport =
            window.innerHeight;

        if (
            rect.bottom < 0 ||
            rect.top > viewport
        ) {
            return;
        }

        const progress =
            Math.max(
                0,
                Math.min(
                    1,
                    (viewport - rect.top) /
                    (viewport + rect.height)
                )
            );

        const x =
            (progress - 0.5) * 20;

        nightBackground.style.transform =
            `translateX(${x}px) scale(1.03)`;

    };


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                ticking = true;

                requestAnimationFrame(
                    updateNight
                );

            }

        },
        { passive: true }
    );

}


/* =====================================================
   WORLD / SECTION PARALLAX
===================================================== */

const parallaxSections =
    $$(".world, .survival, .philosophy, .choice");

if (
    supportsHover &&
    parallaxSections.length
) {

    let parallaxTicking = false;

    const updateParallax = () => {

        parallaxTicking = false;

        const viewport =
            window.innerHeight;

        parallaxSections.forEach(section => {

            const rect =
                section.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > viewport
            ) {
                return;
            }

            const progress =
                (viewport - rect.top) /
                (viewport + rect.height);

            const value =
                Math.max(
                    0,
                    Math.min(1, progress)
                );

            section.style.setProperty(
                "--section-progress",
                value.toFixed(3)
            );

        });

    };


    window.addEventListener(
        "scroll",
        () => {

            if (!parallaxTicking) {

                parallaxTicking = true;

                requestAnimationFrame(
                    updateParallax
                );

            }

        },
        { passive: true }
    );

}


/* =====================================================
   MODAL
===================================================== */

const modal =
    $("#modal");

const modalClose =
    $("#modalClose");


function openModal() {

    if (!modal) return;

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal() {

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


if (modalClose) {
    modalClose.addEventListener(
        "click",
        closeModal
    );
}


const modalBackdrop =
    $(".modal-backdrop");

if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeModal
    );

}


/* =====================================================
   ENTER WORLD — BOTH BUTTONS
   FIX FOR DUPLICATE IDs
===================================================== */

const enterButtons =
    $$(".enter-button");

enterButtons.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            createRipple(
                button,
                event
            );

            openModal();

        }
    );

});


/* =====================================================
   WAIT BUTTON
===================================================== */

const waitButton =
    $("#waitButton");

const waitStatus =
    $("#waitStatus");

const waitingKey =
    "eyl_waited";


if (waitButton) {

    waitButton.addEventListener(
        "click",
        () => {

            waitButton.disabled = true;

            waitButton.innerHTML =
                `<span>ОЖИДАНИЕ</span>
                 <span>...</span>`;


            if (waitStatus) {

                waitStatus.textContent =
                    "СИГНАЛ ПРИНЯТ. ЖДИ.";

            }


            localStorage.setItem(
                waitingKey,
                "true"
            );


            setTimeout(() => {

                if (waitStatus) {

                    waitStatus.textContent =
                        "ПРОЕКТ ПРОДОЛЖАЕТСЯ.";

                }

            }, 1800);


            setTimeout(() => {

                if (waitStatus) {

                    waitStatus.textContent =
                        "КОГДА-НИБУДЬ ТЫ УЗНАЕШЬ БОЛЬШЕ.";

                }

            }, 3800);


            setTimeout(() => {

                waitButton.disabled = false;

                waitButton.innerHTML =
                    `<span>ЖДАТЬ</span>
                     <span>→</span>`;

            }, 5500);

        }
    );

}


if (
    waitStatus &&
    localStorage.getItem(waitingKey)
) {

    waitStatus.textContent =
        "ТЫ УЖЕ ОСТАВИЛ СИГНАЛ.";

}


/* =====================================================
   MODAL ACTIONS
===================================================== */

const stayButton =
    $("#stayButton");

const backButton =
    $("#backButton");


if (stayButton) {

    stayButton.addEventListener(
        "click",
        closeModal
    );

}


if (backButton) {

    backButton.addEventListener(
        "click",
        closeModal
    );

}


/* =====================================================
   SECRET LORE
===================================================== */

const secretMessage =
    $(".secret-message");

const secretClose =
    $("#secretClose");


function openSecret() {

    if (!secretMessage) return;

    secretMessage.classList.add("open");

    secretMessage.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeSecret() {

    if (!secretMessage) return;

    secretMessage.classList.remove(
        "open"
    );

    secretMessage.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (secretClose) {

    secretClose.addEventListener(
        "click",
        closeSecret
    );

}


/* =====================================================
   SECRET KEY SEQUENCE
===================================================== */

const secretSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight"
];

let secretPosition = 0;


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            secretSequence[secretPosition]
        ) {

            secretPosition++;

            if (
                secretPosition ===
                secretSequence.length
            ) {

                openSecret();

                secretPosition = 0;

            }

        } else {

            secretPosition = 0;

        }

    }
);


/* =====================================================
   BUTTON RIPPLE
===================================================== */

function createRipple(button, event) {

    if (!button) return;

    const rect =
        button.getBoundingClientRect();

    const ripple =
        document.createElement("span");

    ripple.className =
        "button-ripple";

    ripple.style.left =
        `${event.clientX - rect.left}px`;

    ripple.style.top =
        `${event.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => {

        ripple.remove();

    }, 700);

}


$$(
    ".modal-action"
).forEach(button => {

    button.addEventListener(
        "click",
        event => {

            createRipple(
                button,
                event
            );

        }
    );

});


/* =====================================================
   LAZY IMAGES
===================================================== */

const lazyImages =
    $$("img[data-src]");

if (
    lazyImages.length &&
    "IntersectionObserver" in window
) {

    const imageObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const image =
                        entry.target;

                    const source =
                        image.dataset.src;

                    if (source) {

                        image.src =
                            source;

                        image.removeAttribute(
                            "data-src"
                        );

                    }

                    imageObserver.unobserve(
                        image
                    );

                });

            },
            {
                rootMargin: "200px"
            }
        );


    lazyImages.forEach(image => {

        imageObserver.observe(image);

    });

}


/* =====================================================
   IMAGE ERROR HANDLING
===================================================== */

$$("img").forEach(image => {

    image.addEventListener(
        "error",
        () => {

            image.style.display =
                "none";

        }
    );

});


/* =====================================================
   MOBILE MODE
===================================================== */

if (isMobile) {

    document.documentElement.classList.add(
        "mobile-device"
    );

}


/* =====================================================
   BODY READY
===================================================== */

document.documentElement.classList.add(
    "js-ready"
);


/* =====================================================
   DEBUG
===================================================== */

console.log(
    "%cEYL",
    "color:#d71935;font-size:32px;font-weight:800;letter-spacing:-2px;"
);

console.log(
    "%cСигнал установлен.",
    "color:#777;font-size:12px;"
);

console.log(
    "%cWebsite build: FINAL",
    "color:#777;font-size:11px;"
);