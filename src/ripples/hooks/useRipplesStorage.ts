import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { allRipples } from "@dashboard/ripples/all-ripples";
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

  const getIsManuallyHidden = (ID: string) => storedState[ID]?.manuallyHidden || false;

  const getFirstSeenAt = (ID: string) => storedState[ID]?.firstSeenAt;

  const getIsStale = (ID: string, TTL: number) =>
    getFirstSeenAt(ID) ? getFirstSeenAt(ID) + TTL < nowInSeconds : false;

  const getShouldShow = (ripple: Ripple) =>
    !getIsManuallyHidden(ripple.ID) && !getIsStale(ripple.ID, ripple.TTL);

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

  const hideAllRipples = () => {
    const newState = structuredClone(storedState);

    allRipples.forEach(ripple => {
      lodashSet(newState, `${ripple.ID}.manuallyHidden`, true);
    });

    setStoreState(newState);
  };

  return {
    setFirstSeenFlag,
    getShouldShow,
    setManuallyHidden,
    hideAllRipples,
  };
};
