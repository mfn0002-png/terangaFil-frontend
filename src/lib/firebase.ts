import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 && firebaseConfig.projectId ? initializeApp(firebaseConfig) : getApps().length > 0 ? getApp() : null;

export const messaging = typeof window !== 'undefined' && app ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return null;
  
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });
    if (currentToken) {
      console.log('🔥 [FCM] Token généré:', currentToken);
      return currentToken;
    } else {
      console.warn('⚠️ [FCM] Aucun token d\'enregistrement disponible. Demandez la permission de générer un token.');
      return null;
    }
  } catch (err) {
    console.error('❌ [FCM Error] Erreur lors de la récupération du token:', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log('🔥 [FCM] Message reçu:', payload);
      resolve(payload);
    });
  });
