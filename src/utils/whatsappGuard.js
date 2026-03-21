/**
 * whatsappGuard.js
 *
 * Shared bot-protection utility for all WhatsApp redirect buttons.
 *
 * Protection layers:
 *  1. Honeypot — a module-level var written by a hidden input in Layout.
 *     If a bot fills it, all WA redirects are blocked.
 *  2. Time gate — at least 3 s must pass since the page loaded before
 *     any WA link can be opened.
 */

// ── Honeypot state (module-level, shared across all components) ─────────────
let _honeypotValue = '';
const _pageLoadTime = Date.now();
const MIN_LOAD_MS = 3000;

/** Called by the hidden input in Layout.jsx on every change */
export function setHoneypot(value) {
  _honeypotValue = value;
}

/**
 * Attempts to open a WhatsApp URL.
 * Returns true if allowed, false if blocked (bot detected).
 *
 * @param {string} url  Full wa.me URL with encoded message
 */
export function openWhatsApp(url) {
  // 1. Honeypot check
  if (_honeypotValue.length > 0) {
    console.warn('[Bot Guard] Honeypot triggered — WA redirect blocked.');
    return false;
  }

  // 2. Time gate
  const elapsed = Date.now() - _pageLoadTime;
  if (elapsed < MIN_LOAD_MS) {
    console.warn(`[Bot Guard] Too fast (${elapsed}ms) — WA redirect blocked.`);
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

/** Convenience builder — encodes the message and calls openWhatsApp */
export function openWhatsAppWithMessage(message) {
  return openWhatsApp(
    `https://wa.me/5491158774154?text=${encodeURIComponent(message)}`
  );
}
