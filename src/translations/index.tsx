// @ts-strict-ignore
import { Route } from "@dashboard/components/Router";
import { LanguageCodeEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { useIntl } from "react-intl";
import { type RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { parseTranslationDetailQueryParams } from "./translationQueryParams";
import {
  languageEntitiesPath,
  languageEntityPath,
  languageListPath,
  TranslatableEntities,
} from "./urls";
import {
  TranslationsAttributes as TranslationsAttributesView,
  type TranslationsAttributesQueryParams,
} from "./views/TranslationsAttributes";
import {
  TranslationsCategories as TranslationsCategoriesView,
  type TranslationsCategoriesQueryParams,
} from "./views/TranslationsCategories";
import {
  TranslationsCollections as TranslationsCollectionsView,
  type TranslationsCollectionsQueryParams,
} from "./views/TranslationsCollections";
import TranslationsEntitiesComponent from "./views/TranslationsEntities";
import TranslationsLanguageList from "./views/TranslationsLanguageList";
import {
  TranslationsMenuItem as TranslationsMenuItemView,
  type TranslationsMenuItemQueryParams,
} from "./views/TranslationsMenuItem";
import {
  TranslationsPages as TranslationsPagesView,
  type TranslationsPagesQueryParams,
} from "./views/TranslationsPages";
import {
  TranslationsProducts as TranslationsProductsView,
  type TranslationsProductsQueryParams,
} from "./views/TranslationsProducts";
import {
  TranslationsProductVariants as TranslationsProductVariantsView,
  type TranslationsProductVariantsQueryParams,
} from "./views/TranslationsProductVariants";
import {
  TranslationsSales as TranslationsSalesView,
  type TranslationsSalesQueryParams,
} from "./views/TranslationsSales";
import {
  TranslationsShippingMethod as TranslationsShippingMethodView,
  type TranslationsShippingMethodQueryParams,
} from "./views/TranslationsShippingMethod";
import {
  TranslationsVouchers as TranslationsVouchersView,
  type TranslationsVouchersQueryParams,
} from "./views/TranslationsVouchers";

type TranslationsEntitiesRouteProps = RouteComponentProps<{
  languageCode: string;
}>;

const TranslationsEntities = ({ location, match }: TranslationsEntitiesRouteProps) => {
  const qs = parseQs(location.search.substr(1));

  return <TranslationsEntitiesComponent language={match.params.languageCode} params={qs} />;
};

type TranslationsEntityRouteProps = RouteComponentProps<{
  id: string;
  languageCode: string;
}>;

const TranslationsCategories = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsCategoriesQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsCategoriesView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsCollections = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsCollectionsQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsCollectionsView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsProducts = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductsQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsProductsView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};

type TranslationsProductVariantProps = RouteComponentProps<{
  productId: string;
  id: string;
  languageCode: string;
}>;

const TranslationsProductVariants = ({ location, match }: TranslationsProductVariantProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductVariantsQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsProductVariantsView
      id={decodeURIComponent(match.params.id)}
      productId={decodeURIComponent(match.params.productId)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsSales = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsSalesQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsSalesView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsVouchers = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsVouchersQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsVouchersView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsPages = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsPagesQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsPagesView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsAttributes = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsAttributesQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsAttributesView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsShippingMethod = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsShippingMethodQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsShippingMethodView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsMenuItem = ({ location, match }: TranslationsEntityRouteProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsMenuItemQueryParams = parseTranslationDetailQueryParams(
    qs,
    location.search,
  );

  return (
    <TranslationsMenuItemView
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsRouter = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.translations)} />
      <Switch>
        <Route exact path={languageListPath} component={TranslationsLanguageList} />
        <Route
          exact
          path={languageEntitiesPath(":languageCode")}
          component={TranslationsEntities}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.products, ":id")}
          component={TranslationsProducts}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.products,
            ":productId",
            TranslatableEntities.productVariants,
            ":id",
          )}
          component={TranslationsProductVariants}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.categories, ":id")}
          component={TranslationsCategories}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.collections, ":id")}
          component={TranslationsCollections}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.sales, ":id")}
          component={TranslationsSales}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.vouchers, ":id")}
          component={TranslationsVouchers}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.pages, ":id")}
          component={TranslationsPages}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.attributes, ":id")}
          component={TranslationsAttributes}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.shippingMethods, ":id")}
          component={TranslationsShippingMethod}
        />
        <Route
          exact
          path={languageEntityPath(":languageCode", TranslatableEntities.menuItems, ":id")}
          component={TranslationsMenuItem}
        />
      </Switch>
    </>
  );
};

TranslationsRouter.displayName = "TranslationsRouter";
export default TranslationsRouter;
