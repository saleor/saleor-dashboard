import { LanguageCodeEnum } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  languageEntitiesPath,
  languageEntityPath,
  languageListPath,
  TranslatableEntities,
} from "./urls";
import TranslationsAttributesComponent, {
  TranslationsAttributesQueryParams,
} from "./views/TranslationsAttributes";
import TranslationsCategoriesComponent, {
  TranslationsCategoriesQueryParams,
} from "./views/TranslationsCategories";
import TranslationsCollectionsComponent, {
  TranslationsCollectionsQueryParams,
} from "./views/TranslationsCollections";
import TranslationsEntitiesComponent from "./views/TranslationsEntities";
import TranslationsLanguageList from "./views/TranslationsLanguageList";
import TranslationsMenuItemComponent from "./views/TranslationsMenuItem";
import TranslationsPagesComponent, {
  TranslationsPagesQueryParams,
} from "./views/TranslationsPages";
import TranslationsProductsComponent, {
  TranslationsProductsQueryParams,
} from "./views/TranslationsProducts";
import TranslationsProductVariantsComponent, {
  TranslationsProductVariantsQueryParams,
} from "./views/TranslationsProductVariants";
import TranslationsSaleComponent, {
  TranslationsSalesQueryParams,
} from "./views/TranslationsSales";
import TranslationsShippingMethodComponent, {
  TranslationsShippingMethodQueryParams,
} from "./views/TranslationsShippingMethod";
import TranslationsVouchersComponent, {
  TranslationsVouchersQueryParams,
} from "./views/TranslationsVouchers";

type TranslationsEntitiesRouteProps = RouteComponentProps<{
  languageCode: string;
}>;
const TranslationsEntities: React.FC<TranslationsEntitiesRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));

  return (
    <TranslationsEntitiesComponent
      language={match.params.languageCode}
      params={qs}
    />
  );
};
type TranslationsEntityRouteProps = RouteComponentProps<{
  id: string;
  languageCode: string;
}>;
const TranslationsCategories: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsCategoriesQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsCategoriesComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsCollections: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsCollectionsQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsCollectionsComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsProducts: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductsQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsProductsComponent
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
const TranslationsProductVariants: React.FC<TranslationsProductVariantProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductVariantsQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsProductVariantsComponent
      id={decodeURIComponent(match.params.id)}
      productId={decodeURIComponent(match.params.productId)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsSales: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsSalesQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsSaleComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsVouchers: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsVouchersQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsVouchersComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsPages: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsPagesQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsPagesComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsAttributes: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsAttributesQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsAttributesComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsShippingMethod: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsShippingMethodQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsShippingMethodComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};
const TranslationsMenuItem: React.FC<TranslationsEntityRouteProps> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsShippingMethodQueryParams = {
    activeField: qs.activeField,
  };
  return (
    <TranslationsMenuItemComponent
      id={decodeURIComponent(match.params.id)}
      languageCode={LanguageCodeEnum[match.params.languageCode]}
      params={params}
    />
  );
};

const TranslationsRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.translations)} />
      <Switch>
        <Route
          exact
          path={languageListPath}
          component={TranslationsLanguageList}
        />
        <Route
          exact
          path={languageEntitiesPath(":languageCode")}
          component={TranslationsEntities}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.products,
            ":id",
          )}
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
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.categories,
            ":id",
          )}
          component={TranslationsCategories}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.collections,
            ":id",
          )}
          component={TranslationsCollections}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.sales,
            ":id",
          )}
          component={TranslationsSales}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.vouchers,
            ":id",
          )}
          component={TranslationsVouchers}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.pages,
            ":id",
          )}
          component={TranslationsPages}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.attributes,
            ":id",
          )}
          component={TranslationsAttributes}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.shippingMethods,
            ":id",
          )}
          component={TranslationsShippingMethod}
        />
        <Route
          exact
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.menuItems,
            ":id",
          )}
          component={TranslationsMenuItem}
        />
      </Switch>
    </>
  );
};
TranslationsRouter.displayName = "TranslationsRouter";
export default TranslationsRouter;
