// @ts-strict-ignore
import appleTouchIcon from "@assets/favicons/apple-touch-icon.png";
import favicon16 from "@assets/favicons/favicon-16x16.png";
import favicon32 from "@assets/favicons/favicon-32x32.png";
import safariPinnedTab from "@assets/favicons/safari-pinned-tab.svg";
import { useUser } from "@dashboard/auth";
import { ShopInfoQuery, useShopInfoQuery } from "@dashboard/graphql";
import React, { useEffect } from "react";
import Helmet from "react-helmet";

import { useAnalytics } from "../ProductAnalytics/useAnalytics";
import { extractEmailDomain } from "../ProductAnalytics/utils";

type ShopContext = ShopInfoQuery["shop"];

export const ShopContext = React.createContext<ShopContext>(undefined);

export const ShopProvider = ({ children }) => {
  const { authenticated, user } = useUser();
  const analytics = useAnalytics();
  const { data } = useShopInfoQuery({
    skip: !authenticated || !user,
  });

  useEffect(() => {
    if (data) {
      const { shop } = data;

      analytics.initialize({
        domain: shop.domain.host,
        email_domain: extractEmailDomain(user.email),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Helmet>
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
        <link rel="mask-icon" href={safariPinnedTab} />
      </Helmet>
      <ShopContext.Provider value={data ? data.shop : undefined}>{children}</ShopContext.Provider>
    </>
  );
};

export const Shop = ShopContext.Consumer;
export default Shop;
