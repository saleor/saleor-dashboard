import useQueryParams from "@saleor/hooks/useQueryParams";
import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  saleAddPath,
  SaleCreateUrlQueryParams,
  saleListPath,
  SaleListUrlQueryParams,
  SaleListUrlSortField,
  salePath,
  SaleUrlQueryParams,
  voucherAddPath,
  VoucherCreateUrlQueryParams,
  voucherListPath,
  VoucherListUrlQueryParams,
  VoucherListUrlSortField,
  voucherPath,
  VoucherUrlQueryParams,
} from "./urls";
import SaleCreateViewComponent from "./views/SaleCreate/SaleCreate";
import SaleDetailsViewComponent from "./views/SaleDetails";
import SaleListViewComponent from "./views/SaleList";
import VoucherCreateViewComponent from "./views/VoucherCreate";
import VoucherDetailsViewComponent from "./views/VoucherDetails";
import VoucherListViewComponent from "./views/VoucherList";

const SaleListView: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<SaleListUrlQueryParams>();
  const params: SaleListUrlQueryParams = asSortParams(qs, SaleListUrlSortField);
  return <SaleListViewComponent params={params} />;
};

const SaleDetailsView: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const params = useQueryParams<SaleUrlQueryParams>();

  return (
    <SaleDetailsViewComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const SaleCreateView: React.FC<RouteComponentProps> = () => {
  const params = useQueryParams<SaleCreateUrlQueryParams>();

  return <SaleCreateViewComponent params={params} />;
};

const VoucherListView: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<VoucherListUrlQueryParams>();
  const params: VoucherListUrlQueryParams = asSortParams(
    qs,
    VoucherListUrlSortField,
    VoucherListUrlSortField.code,
  );
  return <VoucherListViewComponent params={params} />;
};

const VoucherDetailsView: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const params = useQueryParams<VoucherUrlQueryParams>();

  return (
    <VoucherDetailsViewComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const VoucherCreateView: React.FC<RouteComponentProps> = () => {
  const params = useQueryParams<VoucherCreateUrlQueryParams>();

  return <VoucherCreateViewComponent params={params} />;
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
