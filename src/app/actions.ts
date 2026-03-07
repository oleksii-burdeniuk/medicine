'use server';

import webpush from 'web-push';

// Read env vars lazily and initialize web-push only when needed to avoid throwing
// during module import (which causes opaque server render errors).
const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

let vapidInitialized = false;
function ensureVapid() {
  if (vapidInitialized) return;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    // Throw a clear error that will be easier to diagnose than an import-time crash
    throw new Error(
      'VAPID keys not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in the environment.'
    );
  }
  webpush.setVapidDetails(
    'mailto:alejandroburdenyk@gmail.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  vapidInitialized = true;
}

type PushSubscriptionInput = {
  endpoint: string;
  expirationTime?: number | null;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

function toWebPushSubscription(
  sub: PushSubscriptionInput
): webpush.PushSubscription {
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    throw new Error('Invalid push subscription payload');
  }

  return {
    endpoint: sub.endpoint,
    expirationTime: sub.expirationTime ?? null,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  };
}

export async function subscribeUser(sub: PushSubscriptionInput) {
  ensureVapid();
  toWebPushSubscription(sub);
  return { success: true };
}

export async function unsubscribeUser() {
  return { success: true };
}

export async function sendNotification(
  message: string,
  sub: PushSubscriptionInput
) {
  ensureVapid();
  const subscription = toWebPushSubscription(sub);

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: '🔔 Medicine App',
        body: message || 'Nowe powiadomienie z aplikacji Medicine!',
        icon: '/icon.png',
      })
    );

    return { success: true };
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
