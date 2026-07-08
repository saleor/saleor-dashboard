import { createContext, type ReactNode, useContext } from "react";

interface ModalLayoutContextValue {
  isHeaderOnly: boolean;
}

const ModalLayoutContext = createContext<ModalLayoutContextValue>({
  isHeaderOnly: false,
});

export const ModalLayoutContextProvider = ({
  children,
  isHeaderOnly,
}: {
  children: ReactNode;
  isHeaderOnly: boolean;
}) => {
  return (
    <ModalLayoutContext.Provider value={{ isHeaderOnly }}>{children}</ModalLayoutContext.Provider>
  );
};

export const useModalLayoutContext = () => useContext(ModalLayoutContext);
