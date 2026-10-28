import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type SidebarBreakpoint = "default" | "wide";

interface SidebarContextValue {
  breakpoint: SidebarBreakpoint;
  setBreakpoint: (breakpoint: SidebarBreakpoint) => void;
  /** Viewer preference for the persistent column; the drawer layout always shows the full nav. */
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "dashboard-sidebar-collapsed";

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [breakpoint, setBreakpoint] = useState<SidebarBreakpoint>("default");
  const [storedCollapsed, setCollapsed] = useLocalStorage<boolean>(
    SIDEBAR_COLLAPSED_STORAGE_KEY,
    false,
  );
  // Anything but a stored `true` (missing, malformed) keeps the full sidebar.
  const isCollapsed = storedCollapsed === true;

  return (
    <SidebarContext.Provider value={{ breakpoint, setBreakpoint, isCollapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebarContext = (): SidebarContextValue => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebarBreakpoint must be used within a SidebarProvider");
  }

  return context;
};

export const useSidebarBreakpointContext = () => {
  const { breakpoint, setBreakpoint } = useSidebarContext();

  return { breakpoint, setBreakpoint };
};

export const useSidebarCollapse = () => {
  const { isCollapsed, setCollapsed } = useSidebarContext();

  return { isCollapsed, setCollapsed };
};

/**
 * Hook to set a custom sidebar breakpoint for a page.
 * The breakpoint is automatically reset to "default" when the component unmounts.
 *
 * @param breakpoint - The breakpoint to use ("default" or "wide")
 *
 * @example
 * ```tsx
 * const MyPage = () => {
 *   useCustomSidebarBreakpoint("wide");
 *   return <div>Page content</div>;
 * };
 * ```
 */
export const useCustomSidebarBreakpoint = (breakpoint: SidebarBreakpoint) => {
  const { setBreakpoint } = useSidebarBreakpointContext();

  useEffect(() => {
    setBreakpoint(breakpoint);

    return () => {
      setBreakpoint("default");
    };
  }, [breakpoint, setBreakpoint]);
};
