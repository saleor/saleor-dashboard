import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ExternalLink from "@saleor/components/ExternalLink";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import settingsIcon from "../../../../assets/images/settings-icon.svg";
import supportIcon from "../../../../assets/images/support-icon.svg";
import { useStyles } from "../../styles";
import { App_app } from "../../types/App";

interface AppDetailsPageProps {
  data: App_app;
  onAppActivate: () => void;
  onAppDeactivate: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  data,
  onAppActivate,
  onAppDeactivate
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Container>
      <PageHeader title={data?.name}>
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
              onClick={data.isActive ? onAppDeactivate : onAppActivate}
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
      <Grid spacing={3} container>
        <Grid xs={12} item>
          <Card>
            <CardTitle
              title={intl.formatMessage({
                defaultMessage: "About this app",
                description: "section header"
              })}
            />
            <CardContent>
              {data ? <Typography>{data?.aboutApp}</Typography> : <Skeleton />}
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} item>
          <Card>
            <CardTitle
              title={intl.formatMessage({
                defaultMessage: "App permissions",
                description: "section header"
              })}
            />
            <CardContent>
              <Typography>
                <FormattedMessage
                  defaultMessage="This app has permissions to:"
                  description="apps about permissions"
                />
              </Typography>
              {!!data?.permissions?.length ? (
                <ul className={classes.permissionsContainer}>
                  {data?.permissions?.map(perm => (
                    <li key={perm.code}>{perm.name}</li>
                  ))}
                </ul>
              ) : (
                <Skeleton />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} item>
          <Card>
            <CardTitle
              title={intl.formatMessage({
                defaultMessage: "Data privacy",
                description: "section header"
              })}
            />
            <CardContent>
              {data ? (
                <>
                  <Typography>{data.dataPrivacy}</Typography>
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
        </Grid>
      </Grid>
    </Container>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
export default AppDetailsPage;
