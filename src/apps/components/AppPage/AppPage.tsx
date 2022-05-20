import { Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import { AppQuery } from "@saleor/graphql";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AppFrame } from "../AppFrame";
import { useStyles } from "./styles";
import useSettingsBreadcrumbs from "./useSettingsBreadcrumbs";

export interface AppPageProps {
  data: AppQuery["app"];
  url: string;
  onError: () => void;
  aboutHref: string;
}

export const AppPage: React.FC<AppPageProps> = ({
  data,
  url,
  aboutHref,
  onError
}) => {
  const classes = useStyles({});
  const [breadcrumbs, onBreadcrumbClick] = useSettingsBreadcrumbs();

  return (
    <Container>
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
          <Button href={aboutHref} variant="primary">
            <FormattedMessage
              id="UCHtG6"
              defaultMessage="About"
              description="button"
            />
          </Button>
          <Button
            component="a"
            href={data?.homepageUrl}
            variant="primary"
            data-tc="open-app"
            target="_blank"
          >
            <FormattedMessage
              id="llC1q8"
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
              id="hdcGSJ"
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
          <AppFrame
            src={url}
            appToken={data.accessToken}
            onError={onError}
            appId={data.id}
          />
        )}
      </div>
      <CardSpacer />
    </Container>
  );
};

AppPage.displayName = "AppPage";
export default AppPage;
