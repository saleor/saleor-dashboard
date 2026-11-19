import { useUser } from "@dashboard/auth/useUser";
import { allRipples } from "@dashboard/ripples/allRipples";
import { type Ripple } from "@dashboard/ripples/types";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/vanilla/utils";
import lodashSet from "lodash/set";
import { useCallback, useMemo } from "react";

/** How long after its release a ripple keeps pointing at the change. */
export const RIPPLE_LIFETIME_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

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
    /** When the signed-in user joined. Undefined while the user is loading. */
    private userJoinedAt: Date | undefined,
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

  /**
   * A ripple points at a change, so it only applies to users who knew the dashboard before it
   * and only while the change is recent. The What's New list ignores this and stays permanent.
   */
  private getIsWithinLifecycle(ripple: Ripple): boolean {
    if (!this.userJoinedAt) {
      return false;
    }

    const releasedAt = ripple.dateAdded.getTime();
    const isNewerThanUser = this.userJoinedAt.getTime() < releasedAt;
    const isRecent = this.now < releasedAt + RIPPLE_LIFETIME_DAYS * DAY_MS;

    return isNewerThanUser && isRecent;
  }

  getShouldShow(ripple: Ripple): boolean {
    return (
      this.getIsWithinLifecycle(ripple) &&
      !this.getIsManuallyHidden(ripple.ID) &&
      !this.getIsStale(ripple.ID, ripple.TTL_seconds)
    );
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
  const dateJoined = useUser().user?.dateJoined;
  const userJoinedAt = useMemo(() => (dateJoined ? new Date(dateJoined) : undefined), [dateJoined]);

  const storage = useMemo(
    () => new RipplesStorage(storedState, setStoreState, allRipples, userJoinedAt),
    [storedState, setStoreState, userJoinedAt],
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
