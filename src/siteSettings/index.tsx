import { Route } from "@dashboard/components/Router";
import { parseQs } from "@dashboard/url-utils";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { siteSettingsPath, SiteSettingsUrlQueryParams } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const params: SiteSettingsUrlQueryParams = parseQs(location.search.slice(1));

  return <SiteSettingsComponent params={params} />;
};

export const SiteSettingsSection: React.FC = () => (
  <Route path={siteSettingsPath} component={SiteSettings} />
);
export default SiteSettingsSection;
