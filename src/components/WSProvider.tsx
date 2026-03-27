'use client';
import { useNotifications } from '@/hooks/useNotifications';

export function WSProvider() {
  useNotifications(); // connexion WS unique pour toute l'app
  return null;
}