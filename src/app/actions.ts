'use server';

import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  'mailto:alejandroburdenyk@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

let subscription: webpush.PushSubscription | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function subscribeUser(sub: any) {
  // Safely cast the browser subscription object
  subscription = sub as webpush.PushSubscription;
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error('No subscription available');

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
