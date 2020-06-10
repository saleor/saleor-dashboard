import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ExternalLink from "@saleor/components/ExternalLink";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import settingsIcon from "../../../../assets/images/settings-icon.svg";
import supportIcon from "../../../../assets/images/support-icon.svg";
import { useStyles } from "../../styles";
import { App_app } from "../../types/App";
import DeactivatedText from "../DeactivatedText";

export interface AppDetailsPageProps {
  loading: boolean;
  data: App_app;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onBack: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  data,
  loading,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onBack
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [settingsUrl, setSettingsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!settingsUrl && data?.configurationUrl) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://127.0.0.1:8080/configuration/form/");
      xhr.setRequestHeader("x-saleor-domain", "localhost:8000");
      xhr.responseType = "blob";
      xhr.onload = (e: ProgressEvent) => {
        const target = e.currentTarget as XMLHttpRequest;
        // const blob = new Blob([target.response], {type:"application/javascript"});
        const urlCreator = window.URL || window.webkitURL;
        const url = urlCreator.createObjectURL(target.response);
        setSettingsUrl(url);
      };
      xhr.send();
    }
  }, [data]);

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.apps)}
      </AppHeader>
      <PageHeader
        title={
          <>
            {data?.name} {!data?.isActive && <DeactivatedText />}
          </>
        }
      >
        <Button
          href={data?.homepageUrl}
          color="primary"
          variant="contained"
          data-tc="open-app"
          target="_blank"
        >
          <FormattedMessage defaultMessage="Open App" description="button" />
        </Button>
      </PageHeader>
      <div className={classes.appHeader}>
        {data ? (
          <div className={classes.appHeaderLinks}>
            <ExternalLink
              className={classes.headerLinkContainer}
              href={data.supportUrl}
              target="_blank"
            >
              <img src={supportIcon} alt="" />
              <FormattedMessage
                defaultMessage="Get Support"
                description="link"
              />
            </ExternalLink>
            <ExternalLink
              className={classes.headerLinkContainer}
              href={data.configurationUrl}
              target="_blank"
            >
              <img src={settingsIcon} alt="" />

              <FormattedMessage
                defaultMessage="Edit settings"
                description="link"
              />
            </ExternalLink>
            <Button
              variant="text"
              color="primary"
              className={classes.headerLinkContainer}
              disableFocusRipple
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
              <img src={activateIcon} alt="" />
              {data?.isActive ? (
                <FormattedMessage
                  defaultMessage="Deactivate"
                  description="link"
                />
              ) : (
                <FormattedMessage
                  defaultMessage="Activate"
                  description="link"
                />
              )}
            </Button>
          </div>
        ) : (
          <Skeleton />
        )}
        <div className={classes.hr} />
      </div>

      <iframe src={settingsUrl} height="400" width="100%" scrolling="no" />
      <iframe
        src="http://127.0.0.1:8080/configuration/form/"
        height="400"
        width="100%"
        scrolling="no"
      />

      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "About this app",
            description: "section header"
          })}
        />
        <CardContent>
          {!loading ? <ReactMarkdown source={data?.aboutApp} /> : <Skeleton />}
        </CardContent>
      </Card>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "App permissions",
            description: "section header"
          })}
        />
        <CardContent>
          {!loading ? (
            <>
              <Typography>
                <FormattedMessage
                  defaultMessage="This app has permissions to:"
                  description="apps about permissions"
                />
              </Typography>
              {!!data?.permissions?.length && (
                <ul className={classes.permissionsContainer}>
                  {data?.permissions?.map(perm => (
                    <li key={perm.code}>{perm.name}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <CardSpacer />

      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Data privacy",
            description: "section header"
          })}
        />
        <CardContent>
          {!loading ? (
            <>
              <Typography>{data?.dataPrivacy}</Typography>
              <ExternalLink
                className={classes.linkContainer}
                href={data?.dataPrivacyUrl}
                target="_blank"
              >
                <FormattedMessage
                  defaultMessage="View this app’s privacy policy"
                  description="app privacy policy link"
                />
              </ExternalLink>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <CardSpacer />
    </Container>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
export default AppDetailsPage;
