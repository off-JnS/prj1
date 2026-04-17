// ==================== LOGO IMPORT ====================

import logoImage from '../public/logo/PRJ1.png?url'

// Set favicon
const link = document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = logoImage
document.head.appendChild(link)

// Set navbar logo
const navbarLogo = document.getElementById('navbarLogo')
if (navbarLogo) {
    navbarLogo.src = logoImage
}

// Set hero logo
const heroLogo = document.getElementById('heroLogo')
if (heroLogo) {
    heroLogo.src = logoImage
}

// ==================== DOM ELEMENTS ====================

const openFormBtn = document.getElementById('openFormBtn');
const openFormBtnHero = document.getElementById('openFormBtnHero');
const closeFormBtn = document.getElementById('closeFormBtn');
const contactModal = document.getElementById('contactModal');
const modalOverlay = document.getElementById('modalOverlay');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const projectsAccessForm = document.getElementById('projectsAccessForm');
const projectsPasswordInput = document.getElementById('projectsPassword');
const projectsFeedback = document.getElementById('projectsFeedback');
const projectsSubmitBtn = document.getElementById('projectsSubmitBtn');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastFocusedElement = null;
const PROJECT_ACCESS_ENDPOINT = '/api/project-access';

// ==================== MODAL FUNCTIONS ====================

function openModal() {
    if (!contactModal) return;
    const modalContent = contactModal.querySelector('.modal-content');
    if (!modalContent) return;

    lastFocusedElement = document.activeElement;
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion) {
        setTimeout(() => {
            modalContent.style.animation = 'slideUp 0.5s ease-out';
        }, 10);
    }

    setTimeout(() => {
        modalContent.focus();
    }, 20);
}

function closeModal() {
    if (!contactModal) return;
    const modalContent = contactModal.querySelector('.modal-content');
    if (!modalContent) return;

    if (!prefersReducedMotion) {
        modalContent.style.animation = 'slideUp 0.4s ease-in reverse';
    }

    setTimeout(() => {
        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }, prefersReducedMotion ? 0 : 400);
}

// ==================== EVENT LISTENERS ====================

if (openFormBtn) {
    openFormBtn.addEventListener('click', openModal);
}
if (openFormBtnHero) {
    openFormBtnHero.addEventListener('click', openModal);
}
if (closeFormBtn) {
    closeFormBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
        closeModal();
    }
});

// ==================== FORM HANDLING ====================

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !message) {
            showFeedback('Bitte füllen Sie alle Felder aus', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFeedback('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
            return;
        }

        // Submit to form action (supports submit-form.com)
        try {
            const formData = new FormData(contactForm);

            const response = await fetch(contactForm.action || window.location.href, {
                method: contactForm.method || 'POST',
                body: formData,
            });

            if (response.ok) {
                showFeedback('Nachricht erfolgreich gesendet! Wir melden uns bald.', 'success');
                contactForm.reset();

                setTimeout(() => {
                    closeModal();
                    if (formFeedback) {
                        formFeedback.classList.remove('success', 'error');
                    }
                }, 2000);
            } else {
                // If the fetch returned a non-OK status (CORS or other issues),
                // fall back to a native form submit so the browser posts directly.
                showFeedback('Problem beim Senden per Fetch — versuche Fallback...', 'error');
                setTimeout(() => contactForm.submit(), 300);
            }
        } catch (error) {
            // On network/CORS errors, show a message and fallback to native submit
            showFeedback('Verbindungsfehler. Versuche native Formularübermittlung...', 'error');
            setTimeout(() => contactForm.submit(), 300);
        }
    });
}

if (projectsAccessForm) {
    projectsAccessForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!projectsPasswordInput) {
            return;
        }

        const password = projectsPasswordInput.value.trim();
        if (!password) {
            showProjectsFeedback('Bitte geben Sie ein Passwort ein.', 'error');
            return;
        }

        setProjectsBusy(true);
        showProjectsFeedback('Pruefe Zugang...', 'loading');

        try {
            const response = await fetch(PROJECT_ACCESS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok || !payload?.success || !payload?.url) {
                showProjectsFeedback('Passwort ungueltig oder Zugang nicht verfuegbar.', 'error');
                return;
            }

            showProjectsFeedback('Zugang bestaetigt. Weiterleitung...', 'success');
            setTimeout(() => {
                window.location.assign(payload.url);
            }, 400);
        } catch (error) {
            showProjectsFeedback('Dienst aktuell nicht erreichbar. Bitte spaeter erneut versuchen.', 'error');
        } finally {
            setProjectsBusy(false);
        }
    });
}

function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.classList.remove('success', 'error');
    formFeedback.classList.add(type);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setProjectsBusy(isBusy) {
    if (projectsSubmitBtn) {
        projectsSubmitBtn.disabled = isBusy;
    }

    if (projectsPasswordInput) {
        projectsPasswordInput.disabled = isBusy;
    }
}

function showProjectsFeedback(message, type) {
    if (!projectsFeedback) {
        return;
    }

    projectsFeedback.textContent = message;
    projectsFeedback.classList.remove('success', 'error', 'loading');
    if (type) {
        projectsFeedback.classList.add(type);
    }
}

// ==================== SCROLL ANIMATIONS ====================

// Intersection Observer for scroll-triggered animations
if (!prefersReducedMotion) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
} else {
    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = '1';
        el.style.animation = 'none';
    });
}

// ==================== SMOOTH SCROLL ENHANCEMENT ====================

// Add subtle parallax effect on scroll
if (!prefersReducedMotion) {
    let ticking = false;
    let lastScrollY = 0;
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    function updateParallax() {
        if (heroContent) {
            heroContent.style.transform = `translateY(${lastScrollY * 0.5}px)`;
        }
        ticking = false;
    }
}

// ==================== BUTTON RIPPLE EFFECT ====================

function addRippleEffect(button) {
    button.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
}

// Apply ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    addRippleEffect(btn);
});

// ==================== INTERACTION ENHANCEMENTS ====================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target === openFormBtn) {
        openModal();
    }
    if (e.key === 'Enter' && e.target === openFormBtnHero) {
        openModal();
    }
});

// (version loader removed)

// Basic translation strings for common UI (extendable)
const translations = {
    en: {
        heroSubtitle: 'Your best partner for digital transformation.',
        heroCTA: 'Contact us',
        sectionTitle: 'Why PRJ1?',
        sectionSubtitle: 'Experience the perfect blend of design and functionality',
        feature1_title: 'Premium Quality',
        feature1_desc: 'Carefully crafted with high standards and proven practices.',
        feature2_title: 'Fast & Efficient',
        feature2_desc: 'Quick response and efficient problem solving.',
        feature3_title: 'Personal Consultation',
        feature3_desc: 'Individual attention and expert advice for your project.',
        ctaText: 'Ready to build something great?',
        ctaSubtext: 'Send me a short message.',
        ctaButton: 'Contact us',
        contactTitle: 'Get in touch',
        contactSubtitle: 'We look forward to your message',
        labelName: 'Your name',
        labelEmail: 'Your email',
        labelMessage: 'Your message',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'Your email',
        messagePlaceholder: 'Your message',
        submitButton: 'Send Message',
        footerText: '© 2026 PRJ1. All rights reserved.',
        projectsTitle: 'Projects',
        projectsSubtitle: 'Client access: enter your password to open your project.',
        projectsPasswordLabel: 'Project password',
        projectsPasswordPlaceholder: 'Project password',
        projectsButton: 'Open Project'
    },
    de: {
        heroSubtitle: 'Ihr bester Partner für digitale Transformation.',
        heroCTA: 'Kontakt aufnehmen',
        sectionTitle: 'Warum PRJ1?',
        sectionSubtitle: 'Erleben Sie die perfekte Verbindung von Design und Funktionalität',
        feature1_title: 'Premium-Qualität',
        feature1_desc: 'Sorgfältig gestaltet mit höchstem Anspruch an Qualität und bewährten Praktiken.',
        feature2_title: 'Schnell & Effizient',
        feature2_desc: 'Schnelle Rückmeldung und effiziente Problemlösung.',
        feature3_title: 'Persönliche Beratung',
        feature3_desc: 'Individuelle Betreuung und fachkundige Beratung für Ihr Projekt.',
        ctaText: 'Bereit, etwas Großes zu schaffen?',
        ctaSubtext: 'Schreiben Sie mir eine kurze Nachricht.',
        ctaButton: 'Kontakt aufnehmen',
        contactTitle: 'Kontakt aufnehmen',
        contactSubtitle: 'Wir freuen uns auf Ihre Nachricht',
        labelName: 'Ihr Name',
        labelEmail: 'Ihre E-Mail',
        labelMessage: 'Ihre Nachricht',
        namePlaceholder: 'Ihr Name',
        emailPlaceholder: 'Ihre E-Mail',
        messagePlaceholder: 'Ihre Nachricht',
        submitButton: 'Nachricht senden',
        footerText: '© 2026 PRJ1. Alle Rechte vorbehalten.',
        projectsTitle: 'Projects',
        projectsSubtitle: 'Kundenzugang: Geben Sie Ihr Passwort ein, um direkt zu Ihrem Projekt zu gelangen.',
        projectsPasswordLabel: 'Projektpasswort',
        projectsPasswordPlaceholder: 'Projektpasswort',
        projectsButton: 'Projekt öffnen'
    },
    fr: {
        heroSubtitle: 'Votre meilleur partenaire pour la transformation numérique.',
        heroCTA: 'Contactez-nous',
        sectionTitle: 'Pourquoi PRJ1 ?',
        sectionSubtitle: 'Découvrez l\'équilibre parfait entre design et fonctionnalité',
        feature1_title: 'Qualité Premium',
        feature1_desc: 'Conçu avec soin selon des normes élevées et des pratiques reconnues.',
        feature2_title: 'Rapide et efficace',
        feature2_desc: 'Réponse rapide et résolution efficace des problèmes.',
        feature3_title: 'Conseil personnalisé',
        feature3_desc: 'Accompagnement individuel et conseils d\'experts pour votre projet.',
        ctaText: 'Prêt à créer quelque chose de grand ?',
        ctaSubtext: 'Envoyez-moi un court message.',
        ctaButton: 'Contactez-nous',
        contactTitle: 'Contactez-nous',
        contactSubtitle: 'Nous attendons votre message',
        labelName: 'Votre nom',
        labelEmail: 'Votre e-mail',
        labelMessage: 'Votre message',
        namePlaceholder: 'Votre nom',
        emailPlaceholder: 'Votre e-mail',
        messagePlaceholder: 'Votre message',
        submitButton: 'Envoyer',
        footerText: '© 2026 PRJ1. Tous droits réservés.'
    },
    es: {
        heroSubtitle: 'Su mejor socio para la transformación digital.',
        heroCTA: 'Contactar',
        sectionTitle: 'Por qué PRJ1?',
        sectionSubtitle: 'Experimenta la mezcla perfecta de diseño y funcionalidad',
        feature1_title: 'Calidad Premium',
        feature1_desc: 'Diseñado cuidadosamente con altos estándares y prácticas comprobadas.',
        feature2_title: 'Rápido y Eficiente',
        feature2_desc: 'Respuesta rápida y resolución eficiente de problemas.',
        feature3_title: 'Asesoramiento Personal',
        feature3_desc: 'Atención individual y asesoramiento experto para su proyecto.',
        ctaText: '¿Listo para crear algo grandioso?',
        ctaSubtext: 'Envíame un mensaje breve.',
        ctaButton: 'Contactar',
        contactTitle: 'Contactar',
        contactSubtitle: 'Esperamos su mensaje',
        labelName: 'Tu nombre',
        labelEmail: 'Tu correo',
        labelMessage: 'Tu mensaje',
        namePlaceholder: 'Tu nombre',
        emailPlaceholder: 'Tu correo',
        messagePlaceholder: 'Tu mensaje',
        submitButton: 'Enviar',
        footerText: '© 2026 PRJ1. Todos los derechos reservados.'
    },
    it: {
        heroSubtitle: 'Il tuo miglior partner per la trasformazione digitale.',
        heroCTA: 'Contattaci',
        sectionTitle: 'Perché PRJ1?',
        sectionSubtitle: 'Scopri la perfetta unione di design e funzionalità',
        feature1_title: 'Qualità Premium',
        feature1_desc: 'Progettato con cura con standard elevati e pratiche consolidate.',
        feature2_title: 'Veloce ed Efficiente',
        feature2_desc: 'Risposta rapida e risoluzione efficiente dei problemi.',
        feature3_title: 'Consulenza Personale',
        feature3_desc: 'Assistenza individuale e consulenza esperta per il tuo progetto.',
        ctaText: 'Pronto a creare qualcosa di straordinario?',
        ctaSubtext: 'Inviami un breve messaggio.',
        ctaButton: 'Contattaci',
        contactTitle: 'Contattaci',
        contactSubtitle: 'Attendiamo il tuo messaggio',
        labelName: 'Il tuo nome',
        labelEmail: 'La tua email',
        labelMessage: 'Il tuo messaggio',
        namePlaceholder: 'Il tuo nome',
        emailPlaceholder: 'La tua email',
        messagePlaceholder: 'Il tuo messaggio',
        submitButton: 'Invia',
        footerText: '© 2026 PRJ1. Tutti i diritti riservati.'
    },
    nl: {
        heroSubtitle: 'Uw beste partner voor digitale transformatie.',
        heroCTA: 'Contact',
        sectionTitle: 'Waarom PRJ1?',
        sectionSubtitle: 'Ervaar de perfecte mix van design en functionaliteit',
        feature1_title: 'Premium kwaliteit',
        feature1_desc: 'Zorgvuldig ontworpen met hoge standaarden en bewezen praktijken.',
        feature2_title: 'Snel & Efficiënt',
        feature2_desc: 'Snelle reactie en efficiënte probleemoplossing.',
        feature3_title: 'Persoonlijk advies',
        feature3_desc: 'Individuele begeleiding en deskundig advies voor uw project.',
        ctaText: 'Klaar om iets geweldigs te bouwen?',
        ctaSubtext: 'Stuur me een kort bericht.',
        ctaButton: 'Contact',
        contactTitle: 'Neem contact op',
        contactSubtitle: 'We kijken uit naar uw bericht',
        labelName: 'Uw naam',
        labelEmail: 'Uw e-mail',
        labelMessage: 'Uw bericht',
        namePlaceholder: 'Uw naam',
        emailPlaceholder: 'Uw e-mail',
        messagePlaceholder: 'Uw bericht',
        submitButton: 'Verstuur',
        footerText: '© 2026 PRJ1. Alle rechten voorbehouden.'
    },
    pt: {
        heroSubtitle: 'O seu melhor parceiro para transformação digital.',
        heroCTA: 'Contactar',
        sectionTitle: 'Por que PRJ1?',
        sectionSubtitle: 'Experimente a mistura perfeita de design e funcionalidade',
        feature1_title: 'Qualidade Premium',
        feature1_desc: 'Cuidadosamente concebido com altos padrões e práticas comprovadas.',
        feature2_title: 'Rápido & Eficiente',
        feature2_desc: 'Resposta rápida e resolução eficiente de problemas.',
        feature3_title: 'Consultoria Pessoal',
        feature3_desc: 'Atenção individual e aconselhamento especializado para o seu projeto.',
        ctaText: 'Pronto para construir algo grandioso?',
        ctaSubtext: 'Envie-me uma mensagem curta.',
        ctaButton: 'Contactar',
        contactTitle: 'Contactar',
        contactSubtitle: 'Aguardamos a sua mensagem',
        labelName: 'O seu nome',
        labelEmail: 'O seu e-mail',
        labelMessage: 'A sua mensagem',
        namePlaceholder: 'O seu nome',
        emailPlaceholder: 'O seu e-mail',
        messagePlaceholder: 'A sua mensagem',
        submitButton: 'Enviar',
        footerText: '© 2026 PRJ1. Todos os direitos reservados.'
    },
    pl: {
        heroSubtitle: 'Twój najlepszy partner w transformacji cyfrowej.',
        heroCTA: 'Skontaktuj się',
        sectionTitle: 'Dlaczego PRJ1?',
        sectionSubtitle: 'Doświadcz doskonałego połączenia designu i funkcjonalności',
        feature1_title: 'Premium jakość',
        feature1_desc: 'Starannie zaprojektowane z wysokimi standardami i sprawdzonymi praktykami.',
        feature2_title: 'Szybkość i wydajność',
        feature2_desc: 'Szybka odpowiedź i efektywne rozwiązywanie problemów.',
        feature3_title: 'Osobiste doradztwo',
        feature3_desc: 'Indywidualne podejście i fachowe doradztwo dla Twojego projektu.',
        ctaText: 'Gotowy, aby stworzyć coś wspaniałego?',
        ctaSubtext: 'Wyślij mi krótką wiadomość.',
        ctaButton: 'Skontaktuj się',
        contactTitle: 'Skontaktuj się',
        contactSubtitle: 'Czekamy na Twoją wiadomość',
        labelName: 'Twoje imię',
        labelEmail: 'Twój e-mail',
        labelMessage: 'Twoja wiadomość',
        namePlaceholder: 'Twoje imię',
        emailPlaceholder: 'Twój e-mail',
        messagePlaceholder: 'Twoja wiadomość',
        submitButton: 'Wyślij',
        footerText: '© 2026 PRJ1. Wszelkie prawa zastrzeżone.'
    }
};

function applyTranslations(languageCode) {
    const locale = translations[languageCode] || translations.en;

    document.querySelectorAll('[data-i18]').forEach((element) => {
        const key = element.getAttribute('data-i18');
        if (!key) {
            return;
        }

        const value = locale[key] || translations.en[key];
        if (value) {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18-placeholder');
        if (!key) {
            return;
        }

        const value = locale[key] || translations.en[key];
        if (value) {
            element.setAttribute('placeholder', value);
        }
    });
}

    // Initialize defaults: keep dark theme and set language (no UI controls)
(function initDefaults() {
    try {
        // enforce dark by default (no theme toggle UI)
        document.body.classList.remove('light');

        // restore saved language or default to English
        const saved = localStorage.getItem('siteLang');
        const code = saved || 'en';
        document.documentElement.lang = code;
        applyTranslations(code);
    } catch (e) {
        applyTranslations('en');
    }
})();
