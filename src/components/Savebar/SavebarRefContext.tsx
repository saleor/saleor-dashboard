import React from "react";

interface SavebarRefContext {
  anchor: React.RefObject<HTMLDivElement | null>;
  setAnchor: (element: HTMLDivElement | null) => void;
}

const SavebarRefContext = React.createContext<SavebarRefContext | null>(null);

export const useSavebarRef = () => {
  const context = React.useContext(SavebarRefContext);

  if (!context) {
    throw new Error("You are trying to use SavebarRefContext outside of its provider");
  }

  return context;
};

export const SavebarRefProvider = ({ children }: { children: React.ReactNode }) => {
  const anchor = React.useRef<HTMLDivElement | null>(null);

  const setAnchor = (element: HTMLDivElement | null) => {
    anchor.current = element;
  };

  return (
    <SavebarRefContext.Provider value={{ anchor, setAnchor }}>
      {children}
    </SavebarRefContext.Provider>
  );
};
