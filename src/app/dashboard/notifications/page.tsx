'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Filter,
  CheckCircle,
  Archive,
  ShieldCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/lib/api';
import { Badge } from '@/components/shared/Badge';
import { toast } from '@/stores/useToastStore';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
       toast.error('Erreur lors du marquage');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      toast.success('Toutes les notifications sont marquées comme lues');
      fetchNotifications();
    } catch (error) {
       toast.error('Erreur');
    }
  };

  const filteredNotifications = filter === 'ALL' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#3D2B1F] tracking-tighter">Mes Notifications</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] italic mt-1">Gérez vos alertes et communications</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-6 py-3 bg-leaf/10 text-leaf rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-leaf hover:text-white transition-all shadow-sm"
          >
            <CheckCircle size={16} />
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[32px] border border-border/30 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-sand/30 p-1 rounded-2xl">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-chocolate text-white shadow-lg' : 'text-chocolate/40 hover:text-chocolate'}`}
          >
            Toutes
          </button>
          <button 
            onClick={() => setFilter('UNREAD')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'UNREAD' ? 'bg-chocolate text-white shadow-lg' : 'text-chocolate/40 hover:text-chocolate'}`}
          >
            Non Lues ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[40px] shadow-xl shadow-foreground/5 border border-border/10 overflow-hidden divide-y divide-border/5">
        {loading ? (
           <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
           </div>
        ) : filteredNotifications.length === 0 ? (
           <div className="p-20 text-center">
              <Archive size={48} className="text-foreground/10 mx-auto mb-4" />
              <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest italic">Aucune notification à afficher</p>
           </div>
        ) : filteredNotifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-8 flex gap-6 items-start transition-all hover:bg-[#FDFCFB]/50 ${!n.isRead ? 'bg-primary/5' : ''}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              n.type === 'SUCCESS' ? 'bg-leaf/10 text-leaf' :
              n.type === 'ERROR' ? 'bg-red-50 text-red-500' :
              'bg-blue-50 text-blue-500'
            }`}>
               {n.type === 'SUCCESS' ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-[#3D2B1F] tracking-tight">{n.title}</h3>
                 <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                 </span>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl">{n.message}</p>
              
              <div className="flex items-center gap-4 pt-4">
                 {!n.isRead && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="text-[10px] font-black text-leaf uppercase tracking-widest hover:underline"
                    >
                      Marquer comme lu
                    </button>
                 )}
                 {n.link && (
                    <a 
                      href={n.link}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      Voir les détails
                    </a>
                 )}
              </div>
            </div>

            <Badge variant={n.type === 'SUCCESS' ? 'success' : n.type === 'ERROR' ? 'danger' : 'info'}>
               {n.type}
            </Badge>
          </div>
        ))}
      </div>

    </div>
  );
}
