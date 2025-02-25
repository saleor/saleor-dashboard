import { createContext, ReactNode, RefObject, useContext, useRef } from "react";

interface SavebarRefContext {
  anchor: RefObject<HTMLDivElement | null>;
  setAnchor: (element: HTMLDivElement | null) => void;
}

export const SavebarRefContext = createContext<SavebarRefContext | null>(null);

export const useSavebarRef = () => {
  const context = useContext(SavebarRefContext);

  if (!context) {
    throw new Error("You are trying to use SavebarRefContext outside of its provider");
  }

  return context;
};

export const SavebarRefProvider = ({ children }: { children: ReactNode }) => {
  const anchor = useRef<HTMLDivElement | null>(null);

  const setAnchor = (element: HTMLDivElement | null) => {
    anchor.current = element;
  };

  return (
    <SavebarRefContext.Provider value={{ anchor, setAnchor }}>
      {children}
    </SavebarRefContext.Provider>
  );
};
