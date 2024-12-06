import { Route } from "@dashboard/components/Router";
import { parse as parseQs } from "qs";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { siteSettingsPath, SiteSettingsUrlQueryParams } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings = ({ location }: RouteComponentProps<{}>) => {
  const params: SiteSettingsUrlQueryParams = parseQs(location.search.slice(1));

  return <SiteSettingsComponent params={params} />;
};

export const SiteSettingsSection = () => <Route path={siteSettingsPath} component={SiteSettings} />;
export default SiteSettingsSection;
