import { Typography } from "@material-ui/core";
import Link from "@saleor/components/Link";
import { AppLink } from "@saleor/new-apps/types";
import React from "react";

import { useLinksStyles } from "./styles";

interface AppListCardLinksProps {
  links: AppLink[];
}

const AppListCardLinks: React.FC<AppListCardLinksProps> = ({ links }) => {
  const classes = useLinksStyles();

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
