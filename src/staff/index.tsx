import { ConditionalStaffMembersFilterProvider } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  staffListPath,
  StaffListUrlQueryParams,
  StaffListUrlSortField,
  staffMemberDetailsPath,
  StaffMemberDetailsUrlQueryParams,
} from "./urls";
import { StaffDetailsView } from "./views/StaffDetails";
import StaffListComponent from "./views/StaffList";

const StaffList = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: StaffListUrlQueryParams = asSortParams(qs, StaffListUrlSortField);

  return (
    <ConditionalStaffMembersFilterProvider locationSearch={location.search}>
      <StaffListComponent params={params} />
    </ConditionalStaffMembersFilterProvider>
  );
};

interface StaffDetailsRouteProps {
  id: string;
}

const StaffDetailsComponent: React.FC<RouteComponentProps<StaffDetailsRouteProps>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: StaffMemberDetailsUrlQueryParams = qs;

  return <StaffDetailsView id={decodeURIComponent(match.params.id)} params={params} />;
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
      <Switch>
        <Route exact path={staffListPath} component={StaffList} />
        <Route path={staffMemberDetailsPath(":id")} component={StaffDetailsComponent} />
      </Switch>
    </>
  );
};

export default Component;
