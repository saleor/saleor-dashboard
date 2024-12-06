import { createContext } from "react";
import * as React from "react";

interface ModalContextValues {
  open?: boolean;
  onChange?: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextValues | null>(null);

export const ModalContextProvider = ({
  children,
  onChange,
  open,
}: {
  children: React.ReactNode;
  onChange?: (open: boolean) => void;
  open?: boolean;
}) => {
  return <ModalContext.Provider value={{ open, onChange }}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("useModalContext must be used within a ModalContextProvider");
  }

  return context;
};
