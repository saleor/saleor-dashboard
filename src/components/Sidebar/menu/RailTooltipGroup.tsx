import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const OPEN_DELAY_MS = 150;
const WARM_WINDOW_MS = 300;

interface RailTooltipGroupValue {
  delayDuration: number;
  onOpenChange: (open: boolean) => void;
}

const RailTooltipGroupContext = createContext<RailTooltipGroupValue>({
  delayDuration: OPEN_DELAY_MS,
  onOpenChange: () => {},
});

/**
 * Macaw gives every tooltip its own provider, so Radix cannot skip the delay between them.
 * While one rail tooltip is open (or just closed), the next opens immediately, so scanning
 * down the icons reads like a single tooltip following the pointer.
 */
export const RailTooltipGroup = ({ children }: { children: ReactNode }) => {
  const [isWarm, setWarm] = useState(false);
  const coolDownTimer = useRef<number>();

  useEffect(function clearCoolDownOnUnmount() {
    return () => window.clearTimeout(coolDownTimer.current);
  }, []);

  const onOpenChange = useCallback((open: boolean): void => {
    window.clearTimeout(coolDownTimer.current);

    if (open) {
      setWarm(true);

      return;
    }

    coolDownTimer.current = window.setTimeout(() => setWarm(false), WARM_WINDOW_MS);
  }, []);

  const value = useMemo(
    () => ({ delayDuration: isWarm ? 0 : OPEN_DELAY_MS, onOpenChange }),
    [isWarm, onOpenChange],
  );

  return (
    <RailTooltipGroupContext.Provider value={value}>{children}</RailTooltipGroupContext.Provider>
  );
};

export const useRailTooltipGroup = (): RailTooltipGroupValue => useContext(RailTooltipGroupContext);
