import { SALEOR_APPS_ENDPOINT } from "@saleor/config";
import { useCallback, useState } from "react";

export interface SaleorApp {
  name: string;
  hostname: string;
}

const saleorAppsEnabled = Boolean(SALEOR_APPS_ENDPOINT);

export const useSaleorApps = () => {
  const [apps, setApps] = useState<SaleorApp[] | undefined>(undefined);

  const fetchApps = useCallback(async () => {
    if (!saleorAppsEnabled) {
      return;
    }

    return fetch(SALEOR_APPS_ENDPOINT)
      .then(response => response.json())
      .then((data: SaleorApp[]) => {
        if (
          !data.every(
            item =>
              typeof item.hostname === "string" ||
              typeof item.name === "string",
          )
        ) {
          console.error(
            'Invalid Saleor Apps data received from Marketplace. Expected array of objects with "name" and "hostname" properties',
          );
          return;
        }

        setApps(data);
      });
  }, []);

  return {
    saleorAppsEnabled,
    apps,
    fetchApps,
  };
};
