import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { Ripple } from "@dashboard/ripples/types";
import lodashSet from "lodash/set";

type StoredRipple = {
  manuallyHidden: boolean;
  firstSeenAt: number; // seconds
};

type StoredRipplesRecord = Record<string, StoredRipple>;

const RIPPLE_STORAGE_KEY = "dashboard-ripples";

// extract plain function and test it
export const useRippleStorage = () => {
  const nowInSeconds = new Date().getTime() / 1000;

  const [storedState, setStoreState] = useLocalStorage<StoredRipplesRecord>(RIPPLE_STORAGE_KEY, {});

  const isManuallyHidden = (ID: string) => storedState[ID]?.manuallyHidden || false;

  const firstSeenAt = (ID: string) => storedState[ID]?.firstSeenAt;

  const isStale = (ID: string, TTL: number) =>
    firstSeenAt(ID) ? firstSeenAt(ID) + TTL < nowInSeconds : false;

  const shouldShow = (ripple: Ripple) =>
    !isManuallyHidden(ripple.ID) && !isStale(ripple.ID, ripple.TTL);

  const setFirstSeenFlag = (ripple: Ripple) => {
    // Do not override, we only store the first event
    if (storedState[ripple.ID]?.firstSeenAt) {
      return;
    }

    const newState = structuredClone(storedState);

    lodashSet(newState, `${ripple.ID}.firstSeenAt`, nowInSeconds);

    setStoreState(newState);
  };

  const setManuallyHidden = (ripple: Ripple) => {
    const newState = structuredClone(storedState);

    lodashSet(newState, `${ripple.ID}.manuallyHidden`, true);

    setStoreState(newState);
  };

  return {
    setFirstSeenFlag,
    shouldShow,
    setManuallyHidden,
  };
};
