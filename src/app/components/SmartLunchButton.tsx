'use client';

export function openSmartLunch() {
  const ua = navigator.userAgent || '';

  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) {
    // ✅ Відкриє апку або App Store
    window.location.href = 'https://app.smartlunch.pl/employees/history';
    return;
  }

  if (isAndroid) {
    // ✅ Відкриє апку або Google Play
    window.location.href =
      'https://play.google.com/store/apps/details?id=pl.smartlunch.smartlunch';
    return;
  }

  // 🖥 Desktop / unknown
  window.open('https://smartlunch.com/application', '_blank');
}
