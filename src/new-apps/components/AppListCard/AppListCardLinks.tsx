import Link from "@dashboard/components/Link";
import useAppLinks from "@dashboard/new-apps/hooks/useAppLinks";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { Typography } from "@material-ui/core";
import React from "react";

import { useLinksStyles } from "./styles";

export interface AppListCardLinksProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
}

const AppListCardLinks: React.FC<AppListCardLinksProps> = ({ app }) => {
  const classes = useLinksStyles();

  const links = useAppLinks(app);

  if (!links.length) {
    return null;
  }

  return (
    <ul className={classes.linkList}>
      {links.map(link => (
        <li key={link.name}>
          <Typography>
            <Link href={link.url} target="_blank">
              {link.name}
            </Link>
          </Typography>
        </li>
      ))}
    </ul>
  );
};
AppListCardLinks.displayName = "AppListCardLinks";
export default AppListCardLinks;
