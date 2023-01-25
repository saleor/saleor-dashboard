import { appsListPath } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import ExternalLink from "@dashboard/components/ExternalLink";
import Skeleton from "@dashboard/components/Skeleton";
import { AppQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { ButtonBase, Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import deleteIcon from "../../../../assets/images/delete.svg";
import supportIcon from "../../../../assets/images/support-icon.svg";
import { useStyles } from "../../styles";
import DeactivatedText from "../DeactivatedText";

export interface AppDetailsPageProps {
  loading: boolean;
  data: AppQuery["app"];
  navigateToApp: () => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  data,
  loading,
  navigateToApp,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <>
      <TopNav
        href={appsListPath}
        title={
          <>
            {data?.name} {!data?.isActive && <DeactivatedText />}
          </>
        }
      >
        <Button onClick={navigateToApp} variant="primary" data-tc="open-app">
          <FormattedMessage
            id="HtfL5/"
            defaultMessage="Open App"
            description="button"
          />
        </Button>
      </TopNav>
      <div className={classes.appHeader}>
        {data ? (
          <div className={classes.appHeaderLinks}>
            <ExternalLink
              className={classes.headerLinkContainer}
              href={data.supportUrl || ""}
              target="_blank"
            >
              <SVG src={supportIcon} />
              <FormattedMessage
                id="Gjb6eq"
                defaultMessage="Get Support"
                description="link"
              />
            </ExternalLink>
            <ButtonBase
              className={classes.headerLinkContainer}
              disableRipple
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
              <SVG src={activateIcon} />
              {data?.isActive ? (
                <FormattedMessage {...buttonMessages.deactivate} />
              ) : (
                <FormattedMessage {...buttonMessages.activate} />
              )}
            </ButtonBase>
            <ButtonBase
              className={classes.headerLinkContainer}
              disableRipple
              onClick={onAppDeleteOpen}
            >
              <SVG src={deleteIcon} />
              <FormattedMessage {...buttonMessages.delete} />
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
            id: "jDIRQV",
            defaultMessage: "About this app",
            description: "section header",
          })}
        />
        <CardContent>
          {!loading ? (
            <ReactMarkdown source={data?.aboutApp ?? ""} />
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "VsGcdP",
            defaultMessage: "App permissions",
            description: "section header",
          })}
        />
        <CardContent>
          {!loading ? (
            <>
              <Typography>
                <FormattedMessage
                  id="7oQUMG"
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

      {data?.dataPrivacyUrl && (
        <Card>
          <CardTitle
            title={intl.formatMessage({
              id: "a55zOn",
              defaultMessage: "Data privacy",
              description: "section header",
            })}
          />
          <CardContent>
            {!loading ? (
              <ExternalLink
                className={classes.linkContainer}
                href={data.dataPrivacyUrl}
                target="_blank"
              >
                <FormattedMessage
                  id="Go50v2"
                  defaultMessage="View this app’s privacy policy"
                  description="app privacy policy link"
                />
              </ExternalLink>
            ) : (
              <Skeleton />
            )}
          </CardContent>
        </Card>
      )}
      <CardSpacer />
    </>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
export default AppDetailsPage;
