import {
  ConditionalDiscountFilterProvider,
  ConditionalVoucherFilterProvider,
} from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { DiscountListUrlQueryParams, DiscountListUrlSortField } from "./discountsUrls";
import {
  saleAddPath,
  saleListPath,
  salePath,
  voucherAddPath,
  VoucherCreateUrlQueryParams,
  voucherListPath,
  VoucherListUrlQueryParams,
  VoucherListUrlSortField,
  voucherPath,
  VoucherUrlQueryParams,
} from "./urls";
import { DiscountCreate } from "./views/DiscountCreate";
import { DiscountDetails } from "./views/DiscountDetails";
import { DiscountList } from "./views/DiscountList";
import VoucherCreateViewComponent from "./views/VoucherCreate";
import VoucherDetailsViewComponent from "./views/VoucherDetails";
import VoucherListViewComponent from "./views/VoucherList";

const SaleListView = () => {
  const qs = parseQs(location.search.substr(1)) as any;

  const params: DiscountListUrlQueryParams = asSortParams(qs, DiscountListUrlSortField);

  return (
    <ConditionalDiscountFilterProvider locationSearch={location.search}>
      <DiscountList params={params} />
    </ConditionalDiscountFilterProvider>
  );
};
const SaleDetailsView = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params = qs;

  return <DiscountDetails id={decodeURIComponent(match.params.id)} params={params} />;
};
const SaleCreateView = () => {
  return <DiscountCreate />;
};
const VoucherListView = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: VoucherListUrlQueryParams = asSortParams(
    qs,
    VoucherListUrlSortField,
    VoucherListUrlSortField.code,
  );

  return (
    <ConditionalVoucherFilterProvider locationSearch={location.search}>
      <VoucherListViewComponent params={params} />
    </ConditionalVoucherFilterProvider>
  );
};
const VoucherDetailsView = ({ match }: RouteComponentProps<{ id: string }>) => {
  const qs = parseQs(location.search.substr(1));
  const params: VoucherUrlQueryParams = qs;

  return <VoucherDetailsViewComponent id={decodeURIComponent(match.params.id)} params={params} />;
};
const VoucherCreateView = ({ location }: RouteComponentProps) => {
  const qs = parseQs(location.search.substr(1));
  const params: VoucherCreateUrlQueryParams = qs;

  return <VoucherCreateViewComponent params={params} />;
};

const DiscountSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
      <Switch>
        <Route exact path={saleListPath} component={SaleListView} />
        <Route exact path={saleAddPath} component={SaleCreateView} />
        <Route exact path={voucherAddPath} component={VoucherCreateView} />
        <Route path={salePath(":id")} component={SaleDetailsView} />
        <Route exact path={voucherListPath} component={VoucherListView} />
        <Route path={voucherPath(":id")} component={VoucherDetailsView} />
      </Switch>
    </>
  );
};

export default DiscountSection;
