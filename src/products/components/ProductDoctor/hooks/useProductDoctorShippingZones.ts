import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";

import {
  fetchProductDoctorShippingZones,
  type ProductDoctorShippingZone,
} from "../fetchProductDoctorShippingZones";

interface UseProductDoctorShippingZonesProps {
  channelIds: string[];
  skip?: boolean;
}

interface UseProductDoctorShippingZonesResult {
  /** Every zone linked to `channelIds`; empty until loaded or on failure. */
  zones: ProductDoctorShippingZone[];
  loading: boolean;
  /** False when the API hides shipping zones from the user. */
  canViewShippingZones: boolean;
  error: Error | null;
}

interface State {
  key: string | null;
  zones: ProductDoctorShippingZone[];
  canViewShippingZones: boolean;
  error: Error | null;
}

export const useProductDoctorShippingZones = ({
  channelIds,
  skip = false,
}: UseProductDoctorShippingZonesProps): UseProductDoctorShippingZonesResult => {
  const apolloClient = useApolloClient();
  const key = skip || channelIds.length === 0 ? null : [...channelIds].sort().join(",");
  const [state, setState] = useState<State>({
    key: null,
    zones: [],
    canViewShippingZones: true,
    error: null,
  });

  useEffect(
    function loadShippingZones() {
      if (key === null) {
        return;
      }

      let cancelled = false;

      fetchProductDoctorShippingZones(apolloClient, key.split(","))
        .then(zones => {
          if (!cancelled) {
            setState({
              key,
              zones: zones ?? [],
              canViewShippingZones: zones !== null,
              error: null,
            });
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setState({
              key,
              zones: [],
              canViewShippingZones: true,
              error: err instanceof Error ? err : new Error("Failed to load shipping zones"),
            });
          }
        });

      return (): void => {
        cancelled = true;
      };
    },
    [apolloClient, key],
  );

  return {
    zones: state.zones,
    loading: key !== null && state.key !== key,
    canViewShippingZones: state.canViewShippingZones,
    error: state.error,
  };
};
