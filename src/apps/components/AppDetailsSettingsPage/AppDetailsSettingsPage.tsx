import Button from "@material-ui/core/Button";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import React, { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import urlJoin from "url-join";

import { useStyles } from "../../styles";
import { App_app } from "../../types/App";

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

  useEffect(() => {
    if (!iframeRef.current?.innerHTML && data?.configurationUrl) {
      fetch(data.configurationUrl, {
        headers: { "x-saleor-domain": backendHost },
        method: "GET"
      })
        .then(async response => {
          const url = new URL(response.url);
          const text = await response.text();
          const content = new DOMParser().parseFromString(text, "text/html");

          const iFrame = document.createElement("iframe");
          iFrame.src = "about:blank";
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
        })
        .catch(() => onError());
    }
  }, [data]);

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.apps)}
      </AppHeader>
      <PageHeader title={data?.name}>
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
      </PageHeader>

      <div className={classes.hr} />
      <CardSpacer />
      <div ref={iframeRef} className={classes.iframeShow} />
      <CardSpacer />
    </Container>
  );
};

AppDetailsSettingsPage.displayName = "AppDetailsSettingsPage";
export default AppDetailsSettingsPage;
