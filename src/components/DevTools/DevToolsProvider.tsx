import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface DevToolPanel {
  id: string;
  label: string;
  component: React.ComponentType;
}

interface DevToolsContextValue {
  isVisible: boolean;
  toggle: () => void;
  panels: DevToolPanel[];
  register: (panel: DevToolPanel) => () => void;
  activePanel: string | null;
  setActivePanel: (id: string) => void;
}

const DevToolsContext = createContext<DevToolsContextValue | null>(null);

export const useDevTools = () => {
  const context = useContext(DevToolsContext);

  if (!context) {
    throw new Error("useDevTools must be used within DevToolsProvider");
  }

  return context;
};

interface DevToolsProviderProps {
  children: ReactNode;
}

export const DevToolsProvider = ({ children }: DevToolsProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [panels, setPanels] = useState<DevToolPanel[]>([]);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const toggle = useCallback(() => setIsVisible(prev => !prev), []);

  const register = useCallback((panel: DevToolPanel) => {
    setPanels(prev => {
      // Don't add duplicates
      if (prev.some(p => p.id === panel.id)) {
        return prev;
      }

      return [...prev, panel];
    });

    // Set first panel as active
    setActivePanel(current => current ?? panel.id);

    // Return unregister function
    return () => {
      setPanels(prev => prev.filter(p => p.id !== panel.id));
    };
  }, []);

  // Keyboard shortcut: Cmd+Shift+D (or Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "KeyD") {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const value = useMemo(
    () => ({
      isVisible,
      toggle,
      panels,
      register,
      activePanel,
      setActivePanel,
    }),
    [isVisible, toggle, panels, register, activePanel],
  );

  return <DevToolsContext.Provider value={value}>{children}</DevToolsContext.Provider>;
};
