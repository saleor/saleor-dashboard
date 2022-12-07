import androidIcon from "@assets/favicons/android-icon-192x192.png";
import appleTouchIcon57 from "@assets/favicons/apple-icon-57x57.png";
import appleTouchIcon60 from "@assets/favicons/apple-icon-60x60.png";
import appleTouchIcon72 from "@assets/favicons/apple-icon-72x72.png";
import appleTouchIcon76 from "@assets/favicons/apple-icon-76x76.png";
import appleTouchIcon114 from "@assets/favicons/apple-icon-114x114.png";
import appleTouchIcon120 from "@assets/favicons/apple-icon-120x120.png";
import appleTouchIcon144 from "@assets/favicons/apple-icon-144x144.png";
import appleTouchIcon152 from "@assets/favicons/apple-icon-152x152.png";
import appleTouchIcon180 from "@assets/favicons/apple-icon-180x180.png";
import favicon16 from "@assets/favicons/favicon-16x16.png";
import favicon32 from "@assets/favicons/favicon-32x32.png";
import favicon96 from "@assets/favicons/favicon-96x96.png";
import { useUser } from "@saleor/auth";
import { ShopInfoQuery, useShopInfoQuery } from "@saleor/graphql";
import React from "react";
import Helmet from "react-helmet";

type ShopContext = ShopInfoQuery["shop"];

export const ShopContext = React.createContext<ShopContext>(undefined);

export const ShopProvider: React.FC = ({ children }) => {
  const { authenticated, user } = useUser();
  const { data } = useShopInfoQuery({
    skip: !authenticated || !user,
  });

  return (
    <>
      <Helmet>
        <link rel="apple-touch-icon" sizes="57x57" href={appleTouchIcon57} />
        <link rel="apple-touch-icon" sizes="60x60" href={appleTouchIcon60} />
        <link rel="apple-touch-icon" sizes="72x72" href={appleTouchIcon72} />
        <link rel="apple-touch-icon" sizes="76x76" href={appleTouchIcon76} />
        <link rel="apple-touch-icon" sizes="114x114" href={appleTouchIcon114} />
        <link rel="apple-touch-icon" sizes="120x120" href={appleTouchIcon120} />
        <link rel="apple-touch-icon" sizes="144x144" href={appleTouchIcon144} />
        <link rel="apple-touch-icon" sizes="152x152" href={appleTouchIcon152} />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon180} />

        <link rel="icon" type="image/png" sizes="192x192" href={androidIcon} />

        <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
        <link rel="icon" type="image/png" sizes="96x96" href={favicon96} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>
      <ShopContext.Provider value={data ? data.shop : undefined}>
        {children}
      </ShopContext.Provider>
    </>
  );
};

export const Shop = ShopContext.Consumer;
export default Shop;
