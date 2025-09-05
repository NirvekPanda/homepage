"use client";

import { createContext, useContext, useState } from 'react';

const PopoverContext = createContext();

export function PopoverProvider({ children }) {
  const [activePopover, setActivePopover] = useState(null);

  const showPopover = (id) => {
    setActivePopover(id);
  };

  const hidePopover = () => {
    setActivePopover(null);
  };

  const isPopoverActive = (id) => {
    return activePopover === id;
  };

  return (
    <PopoverContext.Provider value={{ showPopover, hidePopover, isPopoverActive }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover must be used within a PopoverProvider');
  }
  return context;
}
