import { ConditionalProductTypesFilterProvider } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { Redirect, type RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productTypeAddPath,
  productTypeListPath,
  productTypeListUrl,
  type ProductTypeListUrlQueryParams,
  ProductTypeListUrlSortField,
  productTypePath,
  type ProductTypeUrlQueryParams,
} from "./urls";
import ProductTypeListComponent from "./views/ProductTypeList";
import ProductTypeUpdateComponent from "./views/ProductTypeUpdate";

const ProductTypeList = () => {
  const { search } = useLocation();
  const qs = parseQs(search, {
    ignoreQueryPrefix: true,
    // As a product types list still keeps ids to remove in query params,
    // we need to increase the array limit to 100, default 20,
    // because qs library return object instead of an array when limit is exceeded
    arrayLimit: 100,
  }) as any;
  const params: ProductTypeListUrlQueryParams = asSortParams(qs, ProductTypeListUrlSortField);

  return (
    <ConditionalProductTypesFilterProvider locationSearch={search}>
      <ProductTypeListComponent params={params} />
    </ConditionalProductTypesFilterProvider>
  );
};

/** Legacy /product-types/add → create dialog on the list. */
const ProductTypeCreateRedirect = () => <Redirect to={productTypeListUrl({ action: "create" })} />;

interface ProductTypeUpdateRouteParams {
  id: string;
}

const ProductTypeUpdate = ({ match }: RouteComponentProps<ProductTypeUpdateRouteParams>) => {
  const { search } = useLocation();
  const qs = parseQs(search, { ignoreQueryPrefix: true });
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
        <Route exact path={productTypeAddPath} component={ProductTypeCreateRedirect} />
        <Route path={productTypePath(":id")} component={ProductTypeUpdate} />
      </Switch>
    </>
  );
};

ProductTypeRouter.displayName = "ProductTypeRouter";
export default ProductTypeRouter;
