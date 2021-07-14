import { Button, Typography } from "@material-ui/core";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import useTheme from "@saleor/hooks/useTheme";
import { sectionNames } from "@saleor/intl";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { App_app } from "../../types/App";
import { useStyles } from "./styles";
import useAppConfigLoader from "./useAppConfigLoader";
import useSettingsBreadcrumbs from "./useSettingsBreadcrumbs";

export interface AppDetailsSettingsPageProps {
  backendHost: string;
  data: App_app;
  navigateToDashboard: () => void;
  onBack: () => void;
  onError: () => void;
}

export const AppDetailsSettingsPage: React.FC<AppDetailsSettingsPageProps> = ({
  backendHost,
  data,
  navigateToDashboard,
  onBack,
  onError
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [breadcrumbs, onBreadcrumbClick] = useSettingsBreadcrumbs();
  const { sendThemeToExtension } = useTheme();
  const frameContainer = useAppConfigLoader(data, backendHost, {
    onError,
    onLoad: sendThemeToExtension
  });

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.apps)}
      </AppHeader>
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
          <Button
            onClick={navigateToDashboard}
            variant="contained"
            color="primary"
          >
            <FormattedMessage defaultMessage="Dashboard" description="button" />
          </Button>
          <Button
            href={data?.homepageUrl}
            variant="contained"
            color="primary"
            data-tc="open-app"
            target="_blank"
          >
            <FormattedMessage defaultMessage="My App" description="button" />
          </Button>
          <Button
            href={data?.supportUrl}
            variant="contained"
            color="primary"
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
      <div ref={frameContainer} className={classes.iframeContainer} />
      <CardSpacer />
    </Container>
  );
};

AppDetailsSettingsPage.displayName = "AppDetailsSettingsPage";
export default AppDetailsSettingsPage;
