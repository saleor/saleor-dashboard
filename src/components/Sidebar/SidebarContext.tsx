import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SidebarBreakpoint = "default" | "wide";

interface SidebarContextValue {
  breakpoint: SidebarBreakpoint;
  setBreakpoint: (breakpoint: SidebarBreakpoint) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [breakpoint, setBreakpoint] = useState<SidebarBreakpoint>("default");

  return (
    <SidebarContext.Provider value={{ breakpoint, setBreakpoint }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarBreakpointContext = () => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebarBreakpoint must be used within a SidebarProvider");
  }

  return context;
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
