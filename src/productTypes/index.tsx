import useQueryParams from "@saleor/hooks/useQueryParams";
import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

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

const ProductTypeList: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<ProductTypeListUrlQueryParams>();
  const params: ProductTypeListUrlQueryParams = asSortParams(
    qs,
    ProductTypeListUrlSortField,
  );
  return <ProductTypeListComponent params={params} />;
};

interface ProductTypeCreateRouteParams {
  id: string;
}
const ProductTypeCreate: React.FC<RouteComponentProps<
  ProductTypeCreateRouteParams
>> = () => {
  const qs = useQueryParams<ProductTypeAddUrlQueryParams>();
  const params: ProductTypeAddUrlQueryParams = qs;

  return <ProductTypeCreateComponent params={params} />;
};

interface ProductTypeUpdateRouteParams {
  id: string;
}
const ProductTypeUpdate: React.FC<RouteComponentProps<
  ProductTypeUpdateRouteParams
>> = ({ match }) => {
  const qs = useQueryParams<ProductTypeUrlQueryParams>();
  const params: ProductTypeUrlQueryParams = qs;

  return (
    <ProductTypeUpdateComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
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
