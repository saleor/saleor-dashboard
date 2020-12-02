import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { getArrayQueryParam } from "@saleor/utils/urls";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

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
  productVariantCreatorPath,
  productVariantEditPath,
  ProductVariantEditUrlQueryParams
} from "./urls";
import ProductCreateComponent from "./views/ProductCreate";
import ProductImageComponent from "./views/ProductImage";
import ProductListComponent from "./views/ProductList";
import ProductUpdateComponent from "./views/ProductUpdate";
import ProductVariantComponent from "./views/ProductVariant";
import ProductVariantCreateComponent from "./views/ProductVariantCreate";
import ProductVariantCreatorComponent from "./views/ProductVariantCreator";

const ProductList: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductListUrlQueryParams = asSortParams(
    {
      ...qs,
      categories: getArrayQueryParam(qs.categories),
      collections: getArrayQueryParam(qs.collections),
      ids: getArrayQueryParam(qs.ids),
      productTypes: getArrayQueryParam(qs.productTypes)
    },
    ProductListUrlSortField
  );

  return <ProductListComponent params={params} />;
};

const ProductUpdate: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductUrlQueryParams = qs;

  return (
    <ProductUpdateComponent
      id={decodeURIComponent(match.params.id)}
      params={{
        ...params,
        ids: getArrayQueryParam(qs.ids)
      }}
    />
  );
};

const ProductCreate: React.FC<RouteComponentProps<any>> = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return <ProductCreateComponent params={params} />;
};

const ProductVariant: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductVariantEditUrlQueryParams = qs;

  return (
    <ProductVariantComponent
      variantId={decodeURIComponent(match.params.variantId)}
      productId={decodeURIComponent(match.params.productId)}
      params={params}
    />
  );
};

const ProductImage: React.FC<RouteComponentProps<any>> = ({
  location,
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductImageUrlQueryParams = qs;

  return (
    <ProductImageComponent
      imageId={decodeURIComponent(match.params.imageId)}
      productId={decodeURIComponent(match.params.productId)}
      params={params}
    />
  );
};

const ProductVariantCreate: React.FC<RouteComponentProps<any>> = ({
  match
}) => (
  <ProductVariantCreateComponent
    productId={decodeURIComponent(match.params.id)}
  />
);

const ProductVariantCreator: React.FC<RouteComponentProps<{
  id: string;
}>> = ({ match }) => (
  <ProductVariantCreatorComponent id={decodeURIComponent(match.params.id)} />
);

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.products)} />
      <Switch>
        <Route exact path={productListPath} component={ProductList} />
        <Route exact path={productAddPath} component={ProductCreate} />
        <Route
          path={productVariantCreatorPath(":id")}
          component={ProductVariantCreator}
        />
        <Route
          exact
          path={productVariantAddPath(":id")}
          component={ProductVariantCreate}
        />
        <Route
          path={productVariantEditPath(":productId", ":variantId")}
          component={ProductVariant}
        />
        <Route
          path={productImagePath(":productId", ":imageId")}
          component={ProductImage}
        />
        <Route path={productPath(":id")} component={ProductUpdate} />
      </Switch>
    </>
  );
};

export default Component;
