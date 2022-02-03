import { ButtonBase, Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ExternalLink from "@saleor/components/ExternalLink";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import { Backlink, Button } from "@saleor/macaw-ui";
import React from "react";
import SVG from "react-inlinesvg";
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
  navigateToApp: () => void;
  navigateToAppSettings: () => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onBack: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  data,
  loading,
  navigateToApp,
  navigateToAppSettings,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onBack
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.apps)}
      </Backlink>
      <PageHeader
        title={
          <>
            {data?.name} {!data?.isActive && <DeactivatedText />}
          </>
        }
      >
        <Button onClick={navigateToApp} variant="primary" data-tc="open-app">
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
              <SVG src={supportIcon} />
              <FormattedMessage
                defaultMessage="Get Support"
                description="link"
              />
            </ExternalLink>
            {data.configurationUrl && (
              <ButtonBase
                className={classes.headerLinkContainer}
                disableRipple
                onClick={navigateToAppSettings}
              >
                <SVG src={settingsIcon} />
                <FormattedMessage
                  defaultMessage="Edit settings"
                  description="link"
                />
              </ButtonBase>
            )}
            <ButtonBase
              className={classes.headerLinkContainer}
              disableRipple
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
              <SVG src={activateIcon} />
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
            </ButtonBase>
          </div>
        ) : (
          <Skeleton />
        )}
        <div className={classes.hr} />
      </div>

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
