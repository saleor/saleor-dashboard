// @ts-strict-ignore
import { useUser } from "@dashboard/auth/useUser";
import { type ShopInfoQuery, useShopInfoQuery } from "@dashboard/graphql";
import { createContext, type ReactNode, useEffect } from "react";

import { useAnalytics } from "../ProductAnalytics/useAnalytics";
import { extractEmailDomain } from "../ProductAnalytics/utils";

type ShopContext = ShopInfoQuery["shop"];

export const ShopContext = createContext<ShopContext>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { authenticated, user } = useUser();
  const analytics = useAnalytics();
  const { data } = useShopInfoQuery({
    skip: !authenticated,
  });

  useEffect(() => {
    if (data && user) {
      const { shop } = data;

      analytics.initialize({
        domain: shop.domain.host,
        email_domain: extractEmailDomain(user.email),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, user]);

  return (
    <ShopContext.Provider value={data ? data.shop : undefined}>{children}</ShopContext.Provider>
  );
};
