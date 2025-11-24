import { ConditionalProductTypesFilterProvider } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
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

const ProductTypeList = () => {
  const qs = parseQs(location.search, {
    ignoreQueryPrefix: true,
    // As a product types list still keeps ids to remove in query params,
    // we need to increase the array limit to 100, default 20,
    // because qs library return object instead of an array when limit is exceeded
    arrayLimit: 100,
  }) as any;
  const params: ProductTypeListUrlQueryParams = asSortParams(qs, ProductTypeListUrlSortField);

  return (
    <ConditionalProductTypesFilterProvider locationSearch={location.search}>
      <ProductTypeListComponent params={params} />
    </ConditionalProductTypesFilterProvider>
  );
};

interface ProductTypeCreateRouteParams {
  id: string;
}

const ProductTypeCreate = ({ location }: RouteComponentProps<ProductTypeCreateRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeAddUrlQueryParams = qs;

  return <ProductTypeCreateComponent params={params} />;
};

interface ProductTypeUpdateRouteParams {
  id: string;
}

const ProductTypeUpdate = ({ match }: RouteComponentProps<ProductTypeUpdateRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeUrlQueryParams = qs;

  return <ProductTypeUpdateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const ProductTypeRouter = () => {
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
