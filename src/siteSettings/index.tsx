import { Route } from "@dashboard/components/Router";

import { siteSettingsPath } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings = () => {
  return <SiteSettingsComponent />;
};

const SiteSettingsSection = () => <Route path={siteSettingsPath} component={SiteSettings} />;

export default SiteSettingsSection;
