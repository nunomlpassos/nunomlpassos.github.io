(function () {
  'use strict';

  // This is device routing only. It sends no analytics and stores no identifiers.
  function chooseStore(device, query) {
    if (new URLSearchParams(query || '').get('choose') === '1') return null;
    const ua = String(device.userAgent || '');
    if (/bot\b|crawler|spider|facebookexternalhit|Facebot|Twitterbot|TelegramBot|Discordbot|LinkedInBot|Slackbot|Applebot/i.test(ua)) return null;
    if (/Android/i.test(ua) || device.userAgentData?.platform === 'Android') return 'google-play';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'app-store';
    if (/Macintosh/i.test(ua) && Number(device.maxTouchPoints) > 1) return 'app-store';
    return null;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { chooseStore };
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const selected = chooseStore(navigator, window.location.search);
  if (!selected) return;
  const link = document.getElementById(selected);
  const status = document.getElementById('routing-status');
  if (!link || !status) return;
  const storeName = selected === 'app-store' ? 'the App Store' : 'Google Play';
  status.textContent = 'Opening ' + storeName + '… If it does not open, tap a store button above.';
  window.setTimeout(function () {
    try { window.location.replace(link.href); }
    catch (_) { status.textContent = 'Tap a store button above to continue.'; }
  }, 650);
}());
