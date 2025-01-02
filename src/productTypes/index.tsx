import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productTypeAddPath,
  ProductTypeAddUrlQueryParams,
  productTypeListPath,
  ProductTypeListUrlQueryParams,
  ProductTypeListUrlSortField,
  productTypePath,
  ProductTypeUrlQueryParams,
} from "./urls";
import ProductTypeCreateComponent from "./views/ProductTypeCreate";
import ProductTypeListComponent from "./views/ProductTypeList";
import ProductTypeUpdateComponent from "./views/ProductTypeUpdate";

const ProductTypeList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search, {
    ignoreQueryPrefix: true,
    // As a product types list still keeps ids to remove in query params,
    // we need to increase the array limit to 100, default 20,
    // because qs library return object instead of an array when limit is exceeded
    arrayLimit: 100,
  }) as any;
  const params: ProductTypeListUrlQueryParams = asSortParams(qs, ProductTypeListUrlSortField);

  return <ProductTypeListComponent params={params} />;
};

interface ProductTypeCreateRouteParams {
  id: string;
}

const ProductTypeCreate: React.FC<RouteComponentProps<ProductTypeCreateRouteParams>> = ({
  location,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeAddUrlQueryParams = qs;

  return <ProductTypeCreateComponent params={params} />;
};

interface ProductTypeUpdateRouteParams {
  id: string;
}

const ProductTypeUpdate: React.FC<RouteComponentProps<ProductTypeUpdateRouteParams>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeUrlQueryParams = qs;

  return <ProductTypeUpdateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

export const ProductTypeRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.productTypes)} />
      <Switch>
        <Route exact path={productTypeListPath} component={ProductTypeList} />
        <Route exact path={productTypeAddPath} component={ProductTypeCreate} />
        <Route path={productTypePath(":id")} component={ProductTypeUpdate} />
      </Switch>
    </>
  );
};
ProductTypeRouter.displayName = "ProductTypeRouter";
export default ProductTypeRouter;
