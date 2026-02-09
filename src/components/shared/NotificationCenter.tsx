'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import api from '@/lib/api';

interface NotificationCenterProps {
  dark?: boolean;
}

export default function NotificationCenter({ dark = false }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  // Fermeture au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
       console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
       console.error('Failed to mark all as read');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl transition-all group ${
          dark 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-[#F0E6D2]/20 text-[#3D2B1F] hover:bg-[#F0E6D2]/40'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#E07A5F] text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl shadow-chocolate/10 border border-border/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-6 bg-[#FDFCFB] border-b border-border/10 flex items-center justify-between">
             <div>
                <h4 className="text-sm font-black text-[#3D2B1F] uppercase tracking-wider">Centre de Notifications</h4>
                <p className="text-[10px] font-bold text-foreground/30 uppercase mt-0.5">{unreadCount} nouveaux messages</p>
             </div>
             <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                   <button 
                     onClick={markAllAsRead}
                     className="text-[9px] font-black text-[#E07A5F] uppercase tracking-widest hover:underline"
                   >
                     Tout lire
                   </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-foreground/20 hover:text-foreground">
                   <X size={16} />
                </button>
             </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-border/5">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                 <div className="w-12 h-12 bg-border/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-foreground/20">
                    <Bell size={24} />
                 </div>
                 <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest italic">Aucune notification</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div 
                  key={n.id} 
                  className={`p-6 transition-all hover:bg-[#FDFCFB]/50 relative group ${!n.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => !n.Read && markAsRead(n.id)}
                >
                  <div className="flex gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                       n.type === 'SUCCESS' ? 'bg-leaf/10 text-leaf' :
                       n.type === 'ERROR' ? 'bg-red-50 text-red-500' :
                       'bg-blue-50 text-blue-500'
                     }`}>
                        {n.type === 'SUCCESS' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                     </div>
                     <div className="flex-1 space-y-1">
                        <p className="text-xs font-black text-[#3D2B1F] leading-tight">{n.title}</p>
                        <p className="text-[11px] text-foreground/60 leading-relaxed line-clamp-2">{n.message}</p>
                        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest pt-1">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                     </div>
                     {!n.isRead && (
                        <div className="w-2 h-2 bg-[#E07A5F] rounded-full mt-1 shrink-0" />
                     )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-[#FDFCFB] border-t border-border/10 text-center">
             <Link 
               href="/dashboard/notifications" 
               className="text-[10px] font-black text-foreground/40 uppercase tracking-widest hover:text-primary transition-colors"
               onClick={() => setIsOpen(false)}
             >
                Voir tout l'historique
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
