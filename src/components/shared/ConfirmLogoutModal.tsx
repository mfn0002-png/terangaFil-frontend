'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { LogOut, AlertTriangle } from 'lucide-react';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Déconnexion"
      subtitle="Prêt à nous quitter pour aujourd'hui ?"
      icon={LogOut}
      maxWidth="md"
    >
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center text-primary animate-pulse">
            <AlertTriangle size={40} />
          </div>
          <p className="text-foreground/60 text-sm font-bold leading-relaxed px-4">
            Voulez-vous vraiment vous déconnecter de votre espace Teranga ? Vos trésors resteront ici, en sécurité.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
          >
            Rester ici
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 bg-primary hover:bg-foreground" 
            onClick={onConfirm}
            icon={LogOut}
          >
            Me déconnecter
          </Button>
        </div>
      </div>
    </Modal>
  );
};
