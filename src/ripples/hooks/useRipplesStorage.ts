import { allRipples } from "@dashboard/ripples/allRipples";
import { Ripple } from "@dashboard/ripples/types";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/vanilla/utils";
import lodashSet from "lodash/set";

type StoredRipple = {
  manuallyHidden: boolean;
  firstSeenAt: number; // seconds
};

type StoredRipplesRecord = Record<string, StoredRipple>;

const RIPPLE_STORAGE_KEY = "dashboard-ripples";

const storageAtom = atomWithStorage<StoredRipplesRecord>(RIPPLE_STORAGE_KEY, {});

export class RipplesStorage {
  constructor(
    private storedState: StoredRipplesRecord,
    private updateState: (newState: StoredRipplesRecord) => void,
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
    // Do not override, we only store the first event
    if (this.storedState[ripple.ID]?.firstSeenAt) {
      return;
    }

    const newState = structuredClone(this.storedState);

    lodashSet(newState, `${ripple.ID}.firstSeenAt`, this.now);
    this.updateState(newState);
  }

  setManuallyHidden(ripple: Ripple): void {
    const newState = structuredClone(this.storedState);

    lodashSet(newState, `${ripple.ID}.manuallyHidden`, true);
    this.updateState(newState);
  }

  hideAllRipples(): void {
    const newState = structuredClone(this.storedState);

    this.allRipples.forEach(ripple => {
      lodashSet(newState, `${ripple.ID}.manuallyHidden`, true);
    });

    this.updateState(newState);
  }
}

export const useRippleStorage = () => {
  const [storedState, setStoreState] = useAtom(storageAtom);

  const storage = new RipplesStorage(storedState, setStoreState, allRipples);

  return {
    setFirstSeenFlag: (ripple: Ripple) => storage.setFirstSeenFlag(ripple),
    getShouldShow: (ripple: Ripple) => storage.getShouldShow(ripple),
    setManuallyHidden: (ripple: Ripple) => storage.setManuallyHidden(ripple),
    hideAllRipples: () => storage.hideAllRipples(),
  };
};
