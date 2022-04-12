import useShop from "@saleor/hooks/useShop";
import React from "react";

import { maybe } from "../../misc";
import TranslationsLanguageListPage from "../components/TranslationsLanguageListPage";

const TranslationsLanguageList: React.FC = () => {
  const shop = useShop();

  return (
    <TranslationsLanguageListPage languages={maybe(() => shop.languages)} />
  );
};
TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
