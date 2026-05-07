// ==================== LOGO ====================

import logoImage from '../public/logo/PRJ1.png?url'
import { SERVICES } from '../shared/paymentCatalog.js'

const navbarLogo = document.getElementById('navbarLogo')
if (navbarLogo) navbarLogo.src = logoImage

// ==================== STATUS BANNER (Stripe redirect params) ====================

const params = new URLSearchParams(window.location.search)
const statusBanner = document.getElementById('paymentStatus')

if (statusBanner) {
    if (params.get('success') === '1') {
        statusBanner.textContent =
            '✓ Zahlung erfolgreich! Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
        statusBanner.classList.add('success')
        statusBanner.removeAttribute('hidden')
        history.replaceState({}, '', window.location.pathname)
    } else if (params.get('cancelled') === '1') {
        statusBanner.textContent =
            'Zahlung abgebrochen. Sie können jederzeit einen neuen Versuch starten.'
        statusBanner.classList.add('cancelled')
        statusBanner.removeAttribute('hidden')
        history.replaceState({}, '', window.location.pathname)
    }
}

// ==================== RENDER PRICING CARDS ====================

const grid = document.getElementById('pricingGrid')

function formatEur(cents) {
    return (cents / 100).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
}

if (grid) {
    SERVICES.forEach((service) => {
        const oneTime = formatEur(service.price)
        const monthlyHtml = service.monthlyPrice
            ? `<div class="pricing-monthly">
                   <span class="pricing-monthly-amount">${formatEur(service.monthlyPrice)}</span>
                   <span class="pricing-monthly-label">/ Monat</span>
               </div>`
            : ''

        const featuresHtml = service.features
            .map(
                (f) =>
                    `<li class="pricing-feature">
                        <span class="pricing-check" aria-hidden="true">✓</span>
                        ${f}
                    </li>`
            )
            .join('')

        const card = document.createElement('article')
        card.className = `pricing-card${service.highlighted ? ' pricing-card--highlighted' : ''}`
        card.innerHTML = `
            ${service.highlighted ? '<div class="pricing-badge">Beliebt</div>' : ''}
            <div class="pricing-card-header">
                <h2 class="pricing-plan-name">${service.name}</h2>
                <p class="pricing-tagline">${service.tagline}</p>
                <div class="pricing-price">
                    <span class="pricing-amount">${oneTime}</span>
                    <span class="pricing-period">einmalig</span>
                </div>
                ${monthlyHtml}
            </div>
            <ul class="pricing-features" aria-label="Leistungsumfang">
                ${featuresHtml}
            </ul>
            <button
                class="btn pricing-btn${service.highlighted ? ' pricing-btn--primary' : ''}"
                data-service-id="${service.id}"
                ${service.available ? '' : 'disabled'}
                aria-label="${service.name} jetzt buchen"
            >${service.available ? 'Jetzt buchen' : 'Demnächst verfügbar'}</button>
            <div
                class="pricing-card-feedback"
                id="feedback-${service.id}"
                aria-live="polite"
            ></div>
        `
        grid.appendChild(card)
    })
}

// ==================== BUY BUTTON HANDLER ====================

document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-service-id]')
    if (!btn || btn.disabled) return

    const serviceId = btn.dataset.serviceId
    const service = SERVICES.find((s) => s.id === serviceId)

    if (!service?.available || !service?.checkoutUrl) return

    btn.disabled = true
    btn.textContent = 'Weiterleitung…'

    window.location.href = service.checkoutUrl

    // re-enable after a moment in case the browser stays on page (e.g. new tab)
    setTimeout(() => {
        btn.disabled = false
        btn.textContent = 'Jetzt buchen'
    }, 4000)
})
