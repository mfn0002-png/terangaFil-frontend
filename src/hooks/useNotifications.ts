import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/useToastStore';
import api from '@/lib/api';
import { messaging, requestForToken } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';
import { useNotificationStore } from '@/stores/useNotificationStore';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  link?: string;
  createdAt: string;
  isRead?: boolean;
}

export const useNotifications = () => {
  const { token } = useAuthStore();
  const { addToast } = useToastStore();
  const wsRef = useRef<WebSocket | null>(null);
  const isCleanedRef = useRef(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { wsInitialized, setInitialized } = useNotificationStore();

  useEffect(() => {
    if (!token) return;
    if (wsInitialized) return;

    setInitialized(true);
    isCleanedRef.current = false;

    const provider = process.env.NEXT_PUBLIC_NOTIFICATION_PROVIDER || 'websocket';
    if (provider === 'firebase') {
      setupFirebase();
    } else {
      setupWebSocket();
    }

    return () => {
      isCleanedRef.current = true;
      setInitialized(false);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close(1000, 'Composant démonté');
      }
      wsRef.current = null;
    };
  }, [token]);

  const handleIncomingNotification = (notification: Notification) => {
    // Toast
    const toastType = notification.type.toLowerCase() as any;
    addToast(notification.title, toastType, 8000, true);

    // Diffuse à tous les composants via Zustand
    useNotificationStore.getState().pushLive(notification);
  };

  const setupWebSocket = () => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
    const ws = new WebSocket(`${wsUrl}?token=${token}`);

    ws.onopen = () => {
      if (isCleanedRef.current) { ws.close(1000, 'Démonté'); return; }
      console.log('🔌 [WS] Connecté');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleIncomingNotification(data);
      } catch (error) {
        console.error('❌ [WS] Erreur parsing message', error);
      }
    };

    ws.onclose = () => {
      if (isCleanedRef.current) return;
      console.log('🔌 [WS] Déconnecté — reconnexion dans 3s...');
      reconnectTimeoutRef.current = setTimeout(setupWebSocket, 3000);
    };

    ws.onerror = (err) => console.error('❌ [WS] Erreur:', err);

    wsRef.current = ws;
  };

  const setupFirebase = async () => {
    const fcmToken = await requestForToken();
    if (fcmToken) {
      try {
        await api.patch('/notifications/fcm-token', { token: fcmToken });
        console.log('🔥 [FCM] Token enregistré sur le serveur');
      } catch (error) {
        console.error('❌ [FCM Error] Échec enregistrement token');
      }
    }

    if (messaging) {
      onMessage(messaging, (payload) => {
        const notification: Notification = {
          id: Number(payload.data?.id),
          title: payload.notification?.title || payload.data?.title || 'Notification',
          message: payload.notification?.body || payload.data?.message || '',
          type: (payload.data?.type || 'INFO') as any,
          link: payload.data?.link,
          createdAt: payload.data?.createdAt || new Date().toISOString(),
        };
        handleIncomingNotification(notification);
      });
    }
  };
};