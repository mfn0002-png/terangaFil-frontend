import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/useToastStore';
import api from '@/lib/api';
import { messaging, requestForToken } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  link?: string;
  createdAt: string;
  isRead?: boolean;
}

export const useNotifications = (onNewNotification?: (notification: Notification) => void) => {
  const { token } = useAuthStore();
  const { addToast } = useToastStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const provider = process.env.NEXT_PUBLIC_NOTIFICATION_PROVIDER || 'websocket';

    if (provider === 'firebase') {
      setupFirebase();
    } else {
      setupWebSocket();
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [token]);

  const setupWebSocket = () => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws';
    const ws = new WebSocket(`${wsUrl}?token=${token}`);

    ws.onopen = () => console.log('🔌 [WS] Connecté au serveur de notifications');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleIncomingNotification(data);
      } catch (error) {
        console.error('❌ [WS] Erreur parsing message', error);
      }
    };

    ws.onclose = () => console.log('🔌 [WS] Déconnecté');
    wsRef.current = ws;
  };

  const setupFirebase = async () => {
    // 1. Demander la permission et récupérer le token
    const fcmToken = await requestForToken();
    if (fcmToken) {
      // 2. Envoyer le token au backend
      try {
        await api.patch('/notifications/fcm-token', { token: fcmToken });
        console.log('🔥 [FCM] Token enregistré sur le serveur');
      } catch (error) {
        console.error('❌ [FCM Error] Échec de l\'enregistrement du token sur le serveur');
      }
    }

    // 3. Écouter les messages en avant-plan
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('🔥 [FCM] Message reçu (avant-plan):', payload);
        const notification: Notification = {
          id: Number(payload.data?.id),
          title: payload.notification?.title || payload.data?.title || 'Notification',
          message: payload.notification?.body || payload.data?.message || '',
          type: (payload.data?.type || 'INFO') as any,
          link: payload.data?.link,
          createdAt: payload.data?.createdAt || new Date().toISOString()
        };
        handleIncomingNotification(notification);
      });
    }
  };

  const handleIncomingNotification = (notification: Notification) => {
    // Afficher un Toast
    const toastType = notification.type.toLowerCase() === 'info' ? 'info' : 
                      notification.type.toLowerCase() === 'success' ? 'success' : 
                      notification.type.toLowerCase() === 'warning' ? 'warning' : 'error';
    
    addToast(notification.title, toastType as any);

    // Callback pour mettre à jour la liste locale dans le composant
    if (onNewNotification) {
      onNewNotification(notification);
    }
  };

  return {
    provider: process.env.NEXT_PUBLIC_NOTIFICATION_PROVIDER || 'websocket'
  };
};
