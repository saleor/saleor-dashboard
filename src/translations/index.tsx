// @ts-strict-ignore
import { LanguageCodeEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Routes } from "react-router-dom";

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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
const TranslationsProductVariants: React.FC<
  TranslationsProductVariantProps
> = ({ location, match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductVariantsQueryParams = {
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
    activeField: qs.activeField as string,
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
      <Routes>
        <Route path={languageListPath} element={TranslationsLanguageList} />
        <Route
          path={languageEntitiesPath(":languageCode")}
          element={TranslationsEntities}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.products,
            ":id",
          )}
          element={TranslationsProducts}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.products,
            ":productId",
            TranslatableEntities.productVariants,
            ":id",
          )}
          element={TranslationsProductVariants}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.categories,
            ":id",
          )}
          element={TranslationsCategories}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.collections,
            ":id",
          )}
          element={TranslationsCollections}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.sales,
            ":id",
          )}
          element={TranslationsSales}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.vouchers,
            ":id",
          )}
          element={TranslationsVouchers}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.pages,
            ":id",
          )}
          element={TranslationsPages}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.attributes,
            ":id",
          )}
          element={TranslationsAttributes}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.shippingMethods,
            ":id",
          )}
          element={TranslationsShippingMethod}
        />
        <Route
          path={languageEntityPath(
            ":languageCode",
            TranslatableEntities.menuItems,
            ":id",
          )}
          element={TranslationsMenuItem}
        />
      </Routes>
    </>
  );
};
TranslationsRouter.displayName = "TranslationsRouter";
export default TranslationsRouter;
