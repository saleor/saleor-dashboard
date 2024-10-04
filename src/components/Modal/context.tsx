import React, { createContext } from "react";

interface ModalContext {
  open?: boolean;
  onChange?: (open: boolean) => void;
}

const modalContext = createContext<ModalContext | null>(null);

export const ModalContextProvider = ({
  children,
  onChange,
  open,
}: {
  children: React.ReactNode;
  onChange?: (open: boolean) => void;
  open?: boolean;
}) => {
  return <modalContext.Provider value={{ open, onChange }}>{children}</modalContext.Provider>;
};

export const useModalContext = () => {
  const context = React.useContext(modalContext);

  if (!context) {
    throw new Error("useModalContext must be used within a ModalContextProvider");
  }

  return context;
};
