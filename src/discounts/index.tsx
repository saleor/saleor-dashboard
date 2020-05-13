import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { saleDetailsPageTab } from "./components/SaleDetailsPage";
import { voucherDetailsPageTab } from "./components/VoucherDetailsPage";
import {
  saleAddPath,
  saleListPath,
  SaleListUrlQueryParams,
  SaleListUrlSortField,
  salePath,
  SaleUrlQueryParams,
  voucherAddPath,
  voucherListPath,
  VoucherListUrlQueryParams,
  VoucherListUrlSortField,
  voucherPath,
  VoucherUrlQueryParams
} from "./urls";
import SaleCreateView from "./views/SaleCreate";
import SaleDetailsViewComponent from "./views/SaleDetails";
import SaleListViewComponent from "./views/SaleList";
import VoucherCreateView from "./views/VoucherCreate";
import VoucherDetailsViewComponent from "./views/VoucherDetails";
import VoucherListViewComponent from "./views/VoucherList";

const SaleListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: SaleListUrlQueryParams = asSortParams(qs, SaleListUrlSortField);
  return <SaleListViewComponent params={params} />;
};

const SaleDetailsView: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  location
}) => {
  const { activeTab, ...qs } = parseQs(location.search.substr(1));
  const params: SaleUrlQueryParams = {
    ...qs,
    activeTab: saleDetailsPageTab(activeTab)
  };

  return (
    <SaleDetailsViewComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const VoucherListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: VoucherListUrlQueryParams = asSortParams(
    qs,
    VoucherListUrlSortField,
    VoucherListUrlSortField.code
  );
  return <VoucherListViewComponent params={params} />;
};

const VoucherDetailsView: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  location
}) => {
  const { activeTab, ...qs } = parseQs(location.search.substr(1));
  const params: VoucherUrlQueryParams = {
    ...qs,
    activeTab: voucherDetailsPageTab(activeTab)
  };
  return (
    <VoucherDetailsViewComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

export const DiscountSection: React.FC<{}> = () => {
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
