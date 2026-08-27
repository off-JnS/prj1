/// <reference types="vite/client" />

/**
 * Stripe's Buy Button is a custom element registered by
 * https://js.stripe.com/v3/buy-button.js — see
 * src/components/pricing/StripeBuyButton.tsx.
 */
declare namespace JSX {
  interface IntrinsicElements {
    "stripe-buy-button": {
      "buy-button-id"?: string;
      "publishable-key"?: string;
    };
  }
}
