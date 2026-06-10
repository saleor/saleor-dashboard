import * as React from "react";

interface SavebarRefContext {
  anchor: React.RefObject<HTMLDivElement | null>;
  isSavebarMounted: boolean;
  setAnchor: (element: HTMLDivElement | null) => void;
  setSavebarMounted: (isMounted: boolean) => void;
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
  const [isSavebarMounted, setSavebarMounted] = React.useState(false);

  const setAnchor = (element: HTMLDivElement | null) => {
    anchor.current = element;
  };

  return (
    <SavebarRefContext.Provider value={{ anchor, isSavebarMounted, setAnchor, setSavebarMounted }}>
      {children}
    </SavebarRefContext.Provider>
  );
};
