import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import React from "react";

import { maybe } from "../../misc";
import TranslationsLanguageListPage from "../components/TranslationsLanguageListPage";
import { languageEntitiesUrl } from "../urls";

const TranslationsLanguageList: React.FC = () => {
  const navigate = useNavigator();
  const shop = useShop();

  return (
    <TranslationsLanguageListPage
      languages={maybe(() => shop.languages)}
      //   onAdd={undefined}
      onRowClick={code => navigate(languageEntitiesUrl(code, {}))}
    />
  );
};
TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
