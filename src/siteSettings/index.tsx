import useQueryParams from "@saleor/hooks/useQueryParams";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import { siteSettingsPath, SiteSettingsUrlQueryParams } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings: React.FC<RouteComponentProps<{}>> = () => {
  const qs = useQueryParams<SiteSettingsUrlQueryParams>();
  const params: SiteSettingsUrlQueryParams = qs;

  return <SiteSettingsComponent params={params} />;
};

export const SiteSettingsSection: React.FC = () => (
  <Route path={siteSettingsPath} component={SiteSettings} />
);
export default SiteSettingsSection;
