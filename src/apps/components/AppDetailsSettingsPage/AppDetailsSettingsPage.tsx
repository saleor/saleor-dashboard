import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import useTheme from "@saleor/hooks/useTheme";
import { sectionNames } from "@saleor/intl";
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import urlJoin from "url-join";

import { App_app } from "../../types/App";
import { useStyles } from "./styles";
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
  const iframeRef = useRef(null);
  const intl = useIntl();
  const classes = useStyles({});
  const { sendThemeToExtension } = useTheme();
  const [breadcrumbs, onBreadcrumbClick] = useSettingsBreadcrumbs();

  useEffect(() => {
    if (!iframeRef.current?.innerHTML && data?.configurationUrl) {
      fetch(data?.configurationUrl, {
        headers: {
          "x-saleor-domain": backendHost,
          "x-saleor-token": data.accessToken
        },
        method: "GET"
      })
        .then(async response => {
          const url = new URL(response.url);
          const text = await response.text();
          const content = new DOMParser().parseFromString(text, "text/html");

          const iFrame = document.createElement("iframe");
          iFrame.src = "about:blank";
          iFrame.id = "extension-app";
          iframeRef.current.innerHTML = "";
          iframeRef.current.appendChild(iFrame);
          const iFrameDoc =
            iFrame.contentWindow && iFrame.contentWindow.document;

          const documentElement = content.documentElement;
          const formScript = documentElement.querySelector("script");
          const formURL = new URL(documentElement.querySelector("script").src);
          formScript.src = `${urlJoin(url.origin, formURL.pathname)}`;
          iFrameDoc.write(content.documentElement.innerHTML);
          iFrameDoc.close();
          iFrame.contentWindow.onload = sendThemeToExtension;
        })
        .catch(() => onError());
    }
  }, [data]);

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
      <div ref={iframeRef} className={classes.iframeContainer} />
      <CardSpacer />
    </Container>
  );
};

AppDetailsSettingsPage.displayName = "AppDetailsSettingsPage";
export default AppDetailsSettingsPage;
