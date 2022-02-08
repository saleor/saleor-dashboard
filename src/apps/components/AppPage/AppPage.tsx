import { Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import { sectionNames } from "@saleor/intl";
import { Backlink, Button } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { App_app } from "../../types/App";
import { AppFrame } from "../AppFrame";
import { useStyles } from "./styles";
import useSettingsBreadcrumbs from "./useSettingsBreadcrumbs";

export interface AppPageProps {
  data: App_app;
  url: string;
  navigateToAbout: () => void;
  onBack: () => void;
  onError: () => void;
}

export const AppPage: React.FC<AppPageProps> = ({
  data,
  url,
  navigateToAbout,
  onBack,
  onError
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [breadcrumbs, onBreadcrumbClick] = useSettingsBreadcrumbs();

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.apps)}
      </Backlink>
      <Grid variant="uniform">
        <div className={classes.breadcrumbContainer}>
          <div className={classes.breadcrumbs}>
            <Typography
              className={classNames(
                classes.breadcrumb,
                classes.breadcrumbDisabled
              )}
              variant="h5"
            >
              {data?.name}
            </Typography>
            {breadcrumbs.map(b => (
              <Typography
                className={classes.breadcrumb}
                variant="h5"
                onClick={() => onBreadcrumbClick(b.value)}
                key={b.label}
              >
                {b.label}
              </Typography>
            ))}
          </div>
        </div>
        <div className={classes.appSettingsHeader}>
          <Button onClick={navigateToAbout} variant="primary">
            <FormattedMessage defaultMessage="About" description="button" />
          </Button>
          <Button
            component="a"
            href={data?.homepageUrl}
            variant="primary"
            data-tc="open-app"
            target="_blank"
          >
            <FormattedMessage
              defaultMessage="App home page"
              description="button"
            />
          </Button>
          <Button
            component="a"
            href={data?.supportUrl}
            variant="primary"
            data-tc="open-support"
            target="_blank"
          >
            <FormattedMessage
              defaultMessage="Support/FAQ"
              description="button"
            />
          </Button>
        </div>
      </Grid>
      <CardSpacer />

      <Hr />

      <CardSpacer />
      <div className={classes.iframeContainer}>
        {url && (
          <AppFrame src={url} appToken={data.accessToken} onError={onError} />
        )}
      </div>
      <CardSpacer />
    </Container>
  );
};

AppPage.displayName = "AppPage";
export default AppPage;
