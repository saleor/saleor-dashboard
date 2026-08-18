import { useUser } from "@dashboard/auth/useUser";
import {
  useShopNavigationPinsQuery,
  useUpdateShopNavigationPinsMutation,
  useUpdateUserNavigationPinsMutation,
} from "@dashboard/graphql";
import { useCallback, useEffect, useMemo, useState } from "react";

import { NAVIGATION_PINS_METADATA_KEY } from "../constants";
import { parseNavigationPins, serializeNavigationPins } from "../serialization";
import { readOrganizationPinsSnapshot, writeOrganizationPinsSnapshot } from "../snapshotStorage";
import { type NavigationPin } from "../types";

interface UseNavigationPinsResult {
  userPins: NavigationPin[];
  organizationPins: NavigationPin[];
  setUserPins: (pins: NavigationPin[]) => Promise<unknown>;
  setOrganizationPins: (pins: NavigationPin[]) => Promise<unknown>;
  loading: boolean;
}

/**
 * User pins come free with the boot-time `UserDetails` query — the sidebar already blocks on
 * that user for permission filtering, so there is nothing to cache. Organization pins need a
 * query of their own, hence the snapshot.
 */
export const useNavigationPins = (): UseNavigationPinsResult => {
  const { user } = useUser();

  const userPins = useMemo(() => parseNavigationPins(user?.metadata), [user?.metadata]);

  // Read once, synchronously, so cached pins paint on the first frame.
  const [snapshot] = useState(() => readOrganizationPinsSnapshot());

  const { data, loading } = useShopNavigationPinsQuery({ fetchPolicy: "cache-and-network" });

  const liveOrganizationPins = useMemo(
    () => (data?.shop ? parseNavigationPins(data.shop.metadata) : null),
    [data?.shop],
  );

  const organizationPins = liveOrganizationPins ?? snapshot ?? [];

  useEffect(() => {
    if (liveOrganizationPins) {
      writeOrganizationPinsSnapshot(liveOrganizationPins);
    }
  }, [liveOrganizationPins]);

  const [updateUser] = useUpdateUserNavigationPinsMutation();
  const [updateShop] = useUpdateShopNavigationPinsMutation();

  // Core merges metadata by key (`store_value_in_metadata`), so sending only our key leaves
  // feature flags, onboarding state and datagrid settings untouched.
  const setUserPins = useCallback(
    (pins: NavigationPin[]) =>
      updateUser({
        variables: {
          input: {
            metadata: [{ key: NAVIGATION_PINS_METADATA_KEY, value: serializeNavigationPins(pins) }],
          },
        },
      }),
    [updateUser],
  );

  const setOrganizationPins = useCallback(
    (pins: NavigationPin[]) =>
      updateShop({
        variables: {
          input: {
            metadata: [{ key: NAVIGATION_PINS_METADATA_KEY, value: serializeNavigationPins(pins) }],
          },
        },
      }),
    [updateShop],
  );

  return {
    userPins,
    organizationPins,
    setUserPins,
    setOrganizationPins,
    loading: loading && !snapshot,
  };
};
