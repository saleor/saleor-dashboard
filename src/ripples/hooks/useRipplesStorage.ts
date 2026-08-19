import { allRipples } from "@dashboard/ripples/allRipples";
import { type Ripple } from "@dashboard/ripples/types";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/vanilla/utils";
import lodashSet from "lodash/set";
import { useCallback, useMemo } from "react";

type StoredRipple = {
  manuallyHidden: boolean;
  firstSeenAt: number; // seconds
};

type StoredRipplesRecord = Record<string, StoredRipple>;

const RIPPLE_STORAGE_KEY = "dashboard-ripples";

const storageAtom = atomWithStorage<StoredRipplesRecord>(RIPPLE_STORAGE_KEY, {});

type StateUpdater = (
  updater: StoredRipplesRecord | ((prev: StoredRipplesRecord) => StoredRipplesRecord),
) => void;

export class RipplesStorage {
  constructor(
    private storedState: StoredRipplesRecord,
    private updateState: StateUpdater,
    private allRipples: Ripple[],
  ) {}

  private get now() {
    return new Date().getTime();
  }

  private getIsManuallyHidden(ID: string): boolean {
    return this.storedState[ID]?.manuallyHidden || false;
  }

  private getFirstSeenAt(ID: string): number | undefined {
    return this.storedState[ID]?.firstSeenAt;
  }

  private getIsStale(ID: string, TTL: number): boolean {
    const firstSeenAt = this.getFirstSeenAt(ID);

    return firstSeenAt ? firstSeenAt + TTL * 1000 < this.now : false;
  }

  getShouldShow(ripple: Ripple): boolean {
    return !this.getIsManuallyHidden(ripple.ID) && !this.getIsStale(ripple.ID, ripple.TTL_seconds);
  }

  setFirstSeenFlag(ripple: Ripple): void {
    this.updateState(prev => {
      // Do not override — we only store the first event
      if (prev[ripple.ID]?.firstSeenAt) {
        return prev;
      }

      const newState = structuredClone(prev);

      lodashSet(newState, `${ripple.ID}.firstSeenAt`, this.now);

      return newState;
    });
  }

  setManuallyHidden(ripple: Ripple): void {
    // Functional update so a concurrent first-seen write cannot wipe dismiss.
    this.updateState(prev => {
      const newState = structuredClone(prev);

      lodashSet(newState, `${ripple.ID}.manuallyHidden`, true);

      return newState;
    });
  }

  hideAllRipples(): void {
    this.updateState(prev => {
      const newState = structuredClone(prev);

      this.allRipples.forEach(ripple => {
        lodashSet(newState, `${ripple.ID}.manuallyHidden`, true);
      });

      return newState;
    });
  }
}

export const useRippleStorage = () => {
  const [storedState, setStoreState] = useAtom(storageAtom);

  const storage = useMemo(
    () => new RipplesStorage(storedState, setStoreState, allRipples),
    [storedState, setStoreState],
  );

  const setFirstSeenFlag = useCallback(
    (ripple: Ripple) => storage.setFirstSeenFlag(ripple),
    [storage],
  );
  const getShouldShow = useCallback((ripple: Ripple) => storage.getShouldShow(ripple), [storage]);
  const setManuallyHidden = useCallback(
    (ripple: Ripple) => storage.setManuallyHidden(ripple),
    [storage],
  );
  const hideAllRipples = useCallback(() => storage.hideAllRipples(), [storage]);

  return {
    setFirstSeenFlag,
    getShouldShow,
    setManuallyHidden,
    hideAllRipples,
  };
};
