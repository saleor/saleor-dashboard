import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

export type ActiveOrdersNavSection = "drafts" | "orders";

const ActiveOrdersNavStateContext = createContext<ActiveOrdersNavSection | undefined>(undefined);

const ActiveOrdersNavDispatchContext = createContext<
  Dispatch<SetStateAction<ActiveOrdersNavSection | undefined>> | undefined
>(undefined);

interface ActiveOrdersNavProviderProps {
  children: ReactNode;
}

export const ActiveOrdersNavProvider = ({ children }: ActiveOrdersNavProviderProps) => {
  const [activeOrderSection, setActiveOrderSection] = useState<
    ActiveOrdersNavSection | undefined
  >();

  return (
    <ActiveOrdersNavDispatchContext.Provider value={setActiveOrderSection}>
      <ActiveOrdersNavStateContext.Provider value={activeOrderSection}>
        {children}
      </ActiveOrdersNavStateContext.Provider>
    </ActiveOrdersNavDispatchContext.Provider>
  );
};

export const useActiveOrdersNavSection = (): ActiveOrdersNavSection | undefined => {
  return useContext(ActiveOrdersNavStateContext);
};

export const useSetActiveOrdersNavSection = (): Dispatch<
  SetStateAction<ActiveOrdersNavSection | undefined>
> => {
  const setActiveOrderSection = useContext(ActiveOrdersNavDispatchContext);

  if (!setActiveOrderSection) {
    throw new Error("useSetActiveOrdersNavSection must be used within ActiveOrdersNavProvider");
  }

  return setActiveOrderSection;
};

export const useMenuActiveOrderSection = () => {
  const activeOrderSection = useActiveOrdersNavSection();

  return useMemo(() => ({ activeOrderSection }), [activeOrderSection]);
};
