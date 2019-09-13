import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { findInEnum, parseBoolean } from "@saleor/misc";
import { WindowTitle } from "../components/WindowTitle";
import {
  productAddPath,
  productImagePath,
  ProductImageUrlQueryParams,
  productListPath,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productPath,
  ProductUrlQueryParams,
  productVariantAddPath,
  productVariantEditPath,
  ProductVariantEditUrlQueryParams
} from "./urls";
import ProductCreate from "./views/ProductCreate";
import ProductImageComponent from "./views/ProductImage";
import ProductListComponent from "./views/ProductList";
import ProductUpdateComponent from "./views/ProductUpdate";
import ProductVariantComponent from "./views/ProductVariant";
import ProductVariantCreateComponent from "./views/ProductVariantCreate";

const ProductList: React.StatelessComponent<RouteComponentProps<any>> = ({
  location
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductListUrlQueryParams = {
    ...qs,
    asc: parseBoolean(qs.asc),
    sort: qs.sort
      ? findInEnum(qs.sort, ProductListUrlSortField)
      : ProductListUrlSortField.name
  };
  return <ProductListComponent params={params} />;
};

const ProductUpdate: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductUrlQueryParams = qs;

  return (
    <ProductUpdateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const ProductVariant: React.StatelessComponent<RouteComponentProps<any>> = ({
  match
}) => {
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

const ProductImage: React.StatelessComponent<RouteComponentProps<any>> = ({
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

const ProductVariantCreate: React.StatelessComponent<
  RouteComponentProps<any>
> = ({ match }) => {
  return (
    <ProductVariantCreateComponent
      productId={decodeURIComponent(match.params.id)}
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
