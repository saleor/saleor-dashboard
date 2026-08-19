import { Route } from "@dashboard/components/Router";
import {
  notificationsCustomerEmailsPath,
  notificationsSettingsPath,
  notificationsStaffEmailsPath,
} from "@dashboard/notificationsSettings/urls";
import { CustomerEmailsRedirectView } from "@dashboard/notificationsSettings/views/CustomerEmailsRedirect";
import { NotificationsHubView } from "@dashboard/notificationsSettings/views/NotificationsHub";
import { StaffEmailsView } from "@dashboard/notificationsSettings/views/StaffEmails";
import { Switch } from "react-router-dom";

export const NotificationsSettingsRoute = (): JSX.Element => (
  <Switch>
    <Route exact path={notificationsSettingsPath} component={NotificationsHubView} />
    <Route exact path={notificationsStaffEmailsPath} component={StaffEmailsView} />
    <Route exact path={notificationsCustomerEmailsPath} component={CustomerEmailsRedirectView} />
  </Switch>
);
