import { Card, CardActions, CardContent, Typography } from "@material-ui/core";
import Hr from "@saleor/components/Hr";
import Link from "@saleor/components/Link";
import { buttonMessages } from "@saleor/intl";
import { Button, useTheme } from "@saleor/macaw-ui";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import { getAppDetails } from "@saleor/new-apps/utils";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface AppListCardProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToVercelDeploymentPage?: (vercelDeploymentUrl: string) => void;
}

const AppListCard: React.FC<AppListCardProps> = ({
  app,
  navigateToAppInstallPage,
  navigateToVercelDeploymentPage,
}) => {
  const { themeType } = useTheme();
  const classes = useStyles();
  const intl = useIntl();

  const details = getAppDetails(
    intl,
    app,
    navigateToAppInstallPage,
    navigateToVercelDeploymentPage,
  );

  return (
    <>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <div className={classes.cardToolbar}>
            <div
              className={classes.logo}
              style={{
                backgroundColor: app.logo.color,
              }}
            >
              {app.logo.source && <img src={app.logo.source} />}
              {!app.logo.source && (
                <Typography variant="h2">{app.name.en[0] || ""}</Typography>
              )}
            </div>
            <Typography className={classes.cardHeader} variant="h2">
              {app.name.en}
            </Typography>
          </div>
          <Typography className={classes.description} variant="body1">
            {app.description.en}
          </Typography>
          {details.links.length > 0 && (
            <ul className={classes.linkList}>
              {details.links.map(link => (
                <li key={link.name}>
                  <Typography>
                    <Link href={link.url} target="_blank">
                      {link.name}
                    </Link>
                  </Typography>
                </li>
              ))}
            </ul>
          )}
          {app.integrations.length > 0 && (
            <>
              <Typography className={classes.listHeader} variant="h3">
                <FormattedMessage {...messages.integrations} />
              </Typography>
              <ul className={classes.logoList}>
                {app.integrations.map(integration => (
                  <li className={classes.vendorLogo} key={integration.name}>
                    <img
                      title={integration.name}
                      src={
                        themeType === "dark"
                          ? integration.logo.dark.source
                          : integration.logo.light.source
                      }
                      alt={integration.name}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
        {(details.installHandler ||
          details.vercelDeployHandler ||
          details.releaseDate) && (
          <>
            <Hr />
            <CardActions className={classes.cardActions}>
              {details.vercelDeployHandler && (
                <Button
                  variant="secondary"
                  onClick={details.vercelDeployHandler}
                >
                  <FormattedMessage {...messages.deployToVercel} />
                </Button>
              )}
              {details.installHandler && (
                <Button variant="primary" onClick={details.installHandler}>
                  <FormattedMessage {...buttonMessages.install} />
                </Button>
              )}
              {details.releaseDate && (
                <Typography className={classes.releaseDate}>
                  <FormattedMessage
                    {...messages.releaseComingSoon}
                    values={{
                      releaseDate: details.releaseDate,
                    }}
                  />
                </Typography>
              )}
            </CardActions>
          </>
        )}
      </Card>
    </>
  );
};

export default AppListCard;
