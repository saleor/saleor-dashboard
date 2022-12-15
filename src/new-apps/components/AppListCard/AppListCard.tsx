import { Card, CardActions, CardContent, Typography } from "@material-ui/core";
import Hr from "@saleor/components/Hr";
import Link from "@saleor/components/Link";
import { Button, useTheme } from "@saleor/macaw-ui";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface AppLink {
  name: string;
  url: string;
}

const getAppLinks = (intl: IntlShape): AppLink[] => [
  {
    name: intl.formatMessage(messages.repository),
    url: "",
  },
  {
    name: intl.formatMessage(messages.support),
    url: "",
  },
  {
    name: intl.formatMessage(messages.dataPrivacy),
    url: "",
  },
];

interface AppListCardProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
}

const AppListCard: React.FC<AppListCardProps> = ({ app }) => {
  const { themeType } = useTheme();
  const classes = useStyles();
  const intl = useIntl();

  const appLinks = getAppLinks(intl);

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
          {appLinks.length > 0 && (
            <ul className={classes.linkList}>
              {appLinks.map(link => (
                <li key={link.name}>
                  <Typography>
                    <Link href={link.url}>{link.name}</Link>
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
        <Hr />
        <CardActions className={classes.cardActions}>
          <Button variant="secondary">
            <FormattedMessage {...messages.deployToVercel} />
          </Button>
          <Button variant="primary">
            <FormattedMessage {...messages.install} />
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default AppListCard;
