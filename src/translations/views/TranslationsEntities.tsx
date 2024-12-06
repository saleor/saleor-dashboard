// @ts-strict-ignore
import useNavigator from "@dashboard/hooks/useNavigator";
import { createPaginationState } from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { stringifyQs } from "@dashboard/utils/urls";
import { useMemo } from "react";

import { PAGINATE_BY } from "../../config";
import { maybe } from "../../misc";
import TranslationsEntitiesListPage from "../components/TranslationsEntitiesListPage";
import { LanguageEntitiesUrlQueryParams, TranslatableEntities } from "../urls";
import TranslationsAttributeList from "./EntityLists/TranslationsAttributeList";
import TranslationsCategoryList from "./EntityLists/TranslationsCategoryList";
import TranslationsCollectionList from "./EntityLists/TranslationsCollectionList";
import TranslationsMenuItemList from "./EntityLists/TranslationsMenuItemList";
import TranslationsPageList from "./EntityLists/TranslationsPageList";
import TranslationsProductList from "./EntityLists/TranslationsProductList";
import TranslationsSaleList from "./EntityLists/TranslationsSaleList";
import TranslationsShippingMethodList from "./EntityLists/TranslationsShippingMethodList";
import TranslationsVoucherList from "./EntityLists/TranslationsVoucherList";

interface TranslationsEntitiesProps {
  language: string;
  params: LanguageEntitiesUrlQueryParams;
}

const TranslationsEntities = ({ language, params }: TranslationsEntitiesProps) => {
  const navigate = useNavigator();
  const shop = useShop();

  if (!Object.keys(TranslatableEntities).includes(params.tab)) {
    navigate(
      "?" +
        stringifyQs({
          tab: TranslatableEntities.categories,
        }),
      { replace: true },
    );
  }

  const filterCallbacks = {
    onCategoriesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.categories,
          }),
      ),
    onCollectionsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.collections,
          }),
      ),
    onPagesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.pages,
          }),
      ),
    onAttributesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.attributes,
          }),
      ),
    onProductsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.products,
          }),
      ),
    onSalesTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.sales,
          }),
      ),
    onShippingMethodsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.shippingMethods,
          }),
      ),
    onVouchersTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.vouchers,
          }),
      ),
    onMenuItemsTabClick: () =>
      navigate(
        "?" +
          stringifyQs({
            tab: TranslatableEntities.menuItems,
          }),
      ),
  };
  const lang = maybe(() =>
    shop.languages.find(languageFromList => languageFromList.code === language),
  );
  const paginationState = createPaginationState(PAGINATE_BY, params);
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      language: language as any,
    }),
    [params],
  );

  return (
    <TranslationsEntitiesListPage
      filters={{
        current: params.tab,
        ...filterCallbacks,
      }}
      language={lang}
    >
      {params.tab === "categories" ? (
        <TranslationsCategoryList params={params} variables={queryVariables} />
      ) : params.tab === "products" ? (
        <TranslationsProductList params={params} variables={queryVariables} />
      ) : params.tab === "collections" ? (
        <TranslationsCollectionList params={params} variables={queryVariables} />
      ) : params.tab === "sales" ? (
        <TranslationsSaleList params={params} variables={queryVariables} />
      ) : params.tab === "vouchers" ? (
        <TranslationsVoucherList params={params} variables={queryVariables} />
      ) : params.tab === "pages" ? (
        <TranslationsPageList params={params} variables={queryVariables} />
      ) : params.tab === "attributes" ? (
        <TranslationsAttributeList params={params} variables={queryVariables} />
      ) : params.tab === "shippingMethods" ? (
        <TranslationsShippingMethodList params={params} variables={queryVariables} />
      ) : params.tab === "menuItems" ? (
        <TranslationsMenuItemList params={params} variables={queryVariables} />
      ) : null}
    </TranslationsEntitiesListPage>
  );
};

TranslationsEntities.displayName = "TranslationsEntities";
export default TranslationsEntities;
