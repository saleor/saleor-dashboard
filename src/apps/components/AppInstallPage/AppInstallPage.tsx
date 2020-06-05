import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppFetch } from "../../types/AppFetch";

export interface AppInstallPageProps {
  loading: boolean;
  data: AppFetch;
  navigateToAppsList: () => void;
  onSubmit: () => void;
}

export const AppInstallPage: React.FC<AppInstallPageProps> = ({
  data,
  loading,
  navigateToAppsList,
  onSubmit
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const name = data?.appFetchManifest?.manifest?.name || "";

  return (
    <Container>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage(
            {
              defaultMessage: `You are about to install {name}`,
              description: "section header"
            },
            { name }
          )}
        />
        <CardContent></CardContent>
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
                  defaultMessage="Installing this app will give it following permissions:"
                  description="install app permissions"
                />
              </Typography>
              {!!data?.appFetchManifest?.manifest?.permissions?.length && (
                <ul className={classes.permissionsContainer}>
                  {data?.appFetchManifest?.manifest?.permissions?.map(perm => (
                    <li key={perm.code}>{perm.name}</li>
                  ))}
                </ul>
              )}
              <Hr />
              <Typography variant="body2">
                <FormattedMessage
                  defaultMessage="Uninstalling the app will remove all your customer’s personal data stored by {name}. After x hours, request will be sent to {name} to erase all of the data. Learn more about data privacy"
                  description="install app privacy"
                  values={{ name }}
                />
              </Typography>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <CardSpacer />
      <Grid container justify="space-between">
        <Grid xs={6} item>
          <Button
            variant="outlined"
            color="primary"
            onClick={navigateToAppsList}
          >
            <Typography color="primary">
              <FormattedMessage {...buttonMessages.cancel} />
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6} item className={classes.alignRight}>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            <Typography className={classes.installText}>
              <FormattedMessage
                defaultMessage="Install App"
                description="install button"
              />
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

AppInstallPage.displayName = "AppInstallPage";
export default AppInstallPage;
