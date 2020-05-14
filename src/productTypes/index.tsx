import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productTypeAddPath,
  productTypeListPath,
  ProductTypeListUrlQueryParams,
  ProductTypeListUrlSortField,
  productTypePath,
  ProductTypeUrlQueryParams
} from "./urls";
import ProductTypeCreate from "./views/ProductTypeCreate";
import ProductTypeListComponent from "./views/ProductTypeList";
import ProductTypeUpdateComponent from "./views/ProductTypeUpdate";

const ProductTypeList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeListUrlQueryParams = asSortParams(
    qs,
    ProductTypeListUrlSortField
  );
  return <ProductTypeListComponent params={params} />;
};

interface ProductTypeUpdateRouteParams {
  id: string;
}
const ProductTypeUpdate: React.FC<RouteComponentProps<
  ProductTypeUpdateRouteParams
>> = ({ match }) => {
  const qs = parseQs(location.search.substr(1));
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
