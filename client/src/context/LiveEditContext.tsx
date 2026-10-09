import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LiveEditContextType {
  isLiveEdit: boolean;
  toggleLiveEdit: () => void;
  enableLiveEdit: () => void;
  disableLiveEdit: () => void;
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
  openAuthModal: () => void;
}

const LiveEditContext = createContext<LiveEditContextType | undefined>(undefined);

export const LiveEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLiveEdit, setIsLiveEdit] = useState<boolean>(() => {
    const saved = localStorage.getItem('live_edit_mode');
    return saved === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('live_edit_mode', String(isLiveEdit));
  }, [isLiveEdit]);

  const toggleLiveEdit = () => {
    if (!isLiveEdit) {
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
        return;
      }
      setIsLiveEdit(true);
    } else {
      setIsLiveEdit(false);
    }
  };

  const enableLiveEdit = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsLiveEdit(true);
  };

  const disableLiveEdit = () => {
    setIsLiveEdit(false);
  };

  return (
    <LiveEditContext.Provider
      value={{
        isLiveEdit: isLiveEdit && isAuthenticated,
        toggleLiveEdit,
        enableLiveEdit,
        disableLiveEdit,
        isAuthModalOpen,
        closeAuthModal: () => setIsAuthModalOpen(false),
        openAuthModal: () => setIsAuthModalOpen(true),
      }}
    >
      {children}
    </LiveEditContext.Provider>
  );
};

export const useLiveEdit = () => {
  const context = useContext(LiveEditContext);
  if (!context) {
    throw new Error('useLiveEdit must be used within a LiveEditProvider');
  }
  return context;
};
