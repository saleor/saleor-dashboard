import { ConditionalProductFilterProvider } from "@dashboard/components/ConditionalFilter/context";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { getArrayQueryParam } from "@dashboard/utils/urls";
import { useIntl } from "react-intl";
import { Redirect, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productAddPath,
  ProductCreateUrlQueryParams,
  productImagePath,
  ProductImageUrlQueryParams,
  productListPath,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productPath,
  ProductUrlQueryParams,
  productVariantAddPath,
  ProductVariantAddUrlQueryParams,
  productVariantEditPath,
  ProductVariantEditUrlQueryParams,
  productVariantLegacyEditPath,
} from "./urls";
import ProductCreateComponent from "./views/ProductCreate";
import ProductImageComponent from "./views/ProductImage";
import ProductListComponent from "./views/ProductList";
import ProductUpdateComponent from "./views/ProductUpdate";
import ProductVariantComponent from "./views/ProductVariant";
import ProductVariantCreateComponent from "./views/ProductVariantCreate";

interface MatchParams {
  id?: string;
}

interface matchParamsProductVariant {
  variantId?: string;
  productId?: string;
}

const ProductList = ({ location }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ProductListUrlQueryParams = asSortParams(
    {
      ...qs,
      categories: getArrayQueryParam(qs.categories),
      collections: getArrayQueryParam(qs.collections),
      ids: getArrayQueryParam(qs.ids),
      productTypes: getArrayQueryParam(qs.productTypes),
      productKind: qs.productKind,
    },
    ProductListUrlSortField,
    ProductListUrlSortField.date,
    false,
  );

  return (
    <ConditionalProductFilterProvider locationSearch={location.search}>
      <ProductListComponent params={params} />
    </ConditionalProductFilterProvider>
  );
};
const ProductUpdate = ({ match }: RouteComponentProps<MatchParams>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ProductUrlQueryParams = qs;

  return (
    <ProductUpdateComponent
      id={decodeURIComponent(match.params.id!)}
      params={{
        ...params,
        ids: getArrayQueryParam(qs.ids),
      }}
    />
  );
};
const ProductCreate = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return <ProductCreateComponent params={params} />;
};
const ProductVariant = ({ match }: RouteComponentProps<matchParamsProductVariant>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductVariantEditUrlQueryParams = qs;

  return (
    <ProductVariantComponent
      variantId={decodeURIComponent(match.params.variantId ?? "")}
      params={params}
    />
  );
};

const ProductImage = ({
  location,
  match,
}: RouteComponentProps<{ imageId: string; productId: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductImageUrlQueryParams = qs;

  return (
    <ProductImageComponent
      mediaId={decodeURIComponent(match.params.imageId)}
      productId={decodeURIComponent(match.params.productId)}
      params={params}
    />
  );
};
const ProductVariantCreate = ({ match }: RouteComponentProps<MatchParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductVariantAddUrlQueryParams = qs;

  return (
    <ProductVariantCreateComponent
      productId={decodeURIComponent(match.params.id ?? "")}
      params={params}
    />
  );
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.products)} />
      <Switch>
        <Route exact path={productListPath} component={ProductList} />
        <Route exact path={productAddPath} component={ProductCreate} />
        <Route exact path={productVariantAddPath(":id")} component={ProductVariantCreate} />
        {/* Redirect old product variant path to new format
         * TODO: Remove in Saleor Dashboard 3.23 */}
        <Route
          path={productVariantLegacyEditPath(":productId", ":variantId")}
          exact
          render={({ match, location }) => {
            if (!match.params.variantId) {
              return <Redirect to={productListPath} />;
            }

            return (
              <Redirect
                to={{
                  pathname: productVariantEditPath(match.params.variantId),
                  search: location.search,
                }}
              />
            );
          }}
        />
        <Route path={productVariantEditPath(":variantId")} component={ProductVariant} />
        <Route path={productImagePath(":productId", ":imageId")} component={ProductImage} />
        <Route path={productPath(":id")} component={ProductUpdate} />
      </Switch>
    </>
  );
};

export default Component;
