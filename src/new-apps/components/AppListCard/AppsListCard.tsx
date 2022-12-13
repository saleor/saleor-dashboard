import { Typography } from "@material-ui/core";
import Link from "@saleor/components/Link";
import { customAppUrl } from "@saleor/custom-apps/urls";
import { NavigationCardBase } from "@saleor/macaw-ui";
import { SaleorMarketplaceApp } from "@saleor/new-apps/types";
import React from "react";

import { useStyles } from "./styles";

interface AppsListCardProps {
  app: SaleorMarketplaceApp;
}

const AppsListCard: React.FC<AppsListCardProps> = ({ app }) => {
  const classes = useStyles();

  return (
    <Link href={customAppUrl(app.id)}>
      {/* <NavigationCard
        className={classes.appCard}
        title={name}
        description={shortDescription}
        // "layout="raw"" is used to prevent the image from being wrapped in a div
        // It's an experimental feature in NextJS for now
        icon={<img src={logo} width={64} height={64} alt={name} />}
      /> */}

      <NavigationCardBase key={app.name} className={classes.card}>
        <div className={classes.cardToolbar}>
          <div className={classes.logo}>
            <img src={app.logo ?? "/apps/saleor.png"} />
          </div>
          <Typography className={classes.cardHeader} variant="h2">
            {app.name}
          </Typography>
        </div>
        <p className={classes.description}>{app.description}</p>
        <Typography variant="h3" className={classes.listHeader}>
          🚀 Highlighted features:
        </Typography>
        <ul>
          {app.features.map(feature => (
            <li key={feature}>
              <Typography>{feature}</Typography>
            </li>
          ))}
        </ul>
        {app.integrations.length > 0 && (
          <>
            <h3 className={classes.listHeader}>🧩 Integrations:</h3>
            <div className={classes.logoList}>
              {app.integrations.map(integration => (
                <div className={classes.vendorLogo} key={integration.name}>
                  <img
                    title={integration.name}
                    src={integration.legacyLogo}
                    alt={integration.name}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {/* <div className={classes.actions}>{renderCardFooter(app)}</div> */}
      </NavigationCardBase>
    </Link>
  );
};

export default AppsListCard;
