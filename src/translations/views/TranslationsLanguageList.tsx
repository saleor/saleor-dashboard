// @ts-strict-ignore
import useShop from "@dashboard/hooks/useShop";
import React from "react";

import { maybe } from "../../misc";
import TranslationsLanguageListPage from "../components/TranslationsLanguageListPage";

const TranslationsLanguageList: React.FC = () => {
  const shop = useShop();

  return <TranslationsLanguageListPage languages={maybe(() => shop.languages)} />;
};
TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
