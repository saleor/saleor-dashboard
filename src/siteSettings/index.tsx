import { Route } from "@dashboard/components/Router";
import { parseQs } from "@dashboard/url-utils";
import { type RouteComponentProps } from "react-router-dom";

import { siteSettingsPath, type SiteSettingsUrlQueryParams } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings = ({ location }: RouteComponentProps): React.ReactNode => {
  const params: SiteSettingsUrlQueryParams = parseQs(location.search.substr(1));

  return <SiteSettingsComponent params={params} />;
};

const SiteSettingsSection = () => <Route path={siteSettingsPath} component={SiteSettings} />;

export default SiteSettingsSection;
