import { Route } from "@dashboard/components/Router";
import { returnsSettingsPath } from "@dashboard/returnsSettings/urls";
import { ReturnsSettingsView } from "@dashboard/returnsSettings/views";

export const ReturnsSettingsRoute = () => (
  <Route path={returnsSettingsPath} component={ReturnsSettingsView} />
);
