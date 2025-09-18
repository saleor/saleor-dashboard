import { Route } from "@dashboard/components/Router";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { RefundsSettingsView } from "@dashboard/refundsSettings/views";

export const RefundsSettingsRoute = () => (
  <Route path={refundsSettingsPath} component={RefundsSettingsView} />
);
