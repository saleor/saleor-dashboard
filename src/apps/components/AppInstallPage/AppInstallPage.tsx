import saleorDarkLogoSmall from "@assets/images/logo-dark-small.svg";
import plusIcon from "@assets/images/plus-icon.svg";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Hr from "@dashboard/components/Hr";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Skeleton from "@dashboard/components/Skeleton";
import { AppFetchMutation, AppInstallMutation } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Box, Button, GenericAppIcon } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";
import { useStyles } from "./styles";

export interface AppInstallPageProps {
  data: NonNullable<AppFetchMutation["appFetchManifest"]>["manifest"];
  loading: boolean;
  navigateToAppsList: () => void;
  onSubmit: () => SubmitPromise<
    NonNullable<AppInstallMutation["appInstall"]>["errors"]
  >;
}

export const AppInstallPage: React.FC<AppInstallPageProps> = ({
  data,
  loading,
  navigateToAppsList,
  onSubmit,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const name = data?.name || "";

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
      <DetailPageLayout.Content>
        <Box paddingY={9}>
          <CardSpacer />
          <Card>
            <CardTitle
              title={
                loading ? (
                  <Skeleton />
                ) : (
                  intl.formatMessage(messages.title, { name })
                )
              }
            />
            <CardContent className={classes.installCard}>
              {loading ? (
                <CircularProgress />
              ) : (
                <div className={classes.installAppContainer}>
                  <div
                    className={clsx(
                      classes.installIcon,
                      classes.installSaleorIcon,
                    )}
                  >
                    <img src={saleorDarkLogoSmall} alt="" />
                  </div>
                  <img src={plusIcon} alt="" />
                  <div className={classes.installIcon}>
                    <GenericAppIcon />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <CardSpacer />
          <Card>
            {!loading && (
              <CardTitle
                title={intl.formatMessage(messages.permissionsTitle)}
              />
            )}
            <CardContent>
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  <Typography className={classes.installPermissionTitle}>
                    <FormattedMessage
                      {...messages.permissionsInstallDescription}
                    />
                  </Typography>
                  {!!data?.permissions?.length && (
                    <ul className={classes.permissionsContainer}>
                      {data?.permissions?.map(perm => (
                        <li key={perm.code}>{perm.name}</li>
                      ))}
                    </ul>
                  )}
                  <Hr className={classes.installSpacer} />

                  <Typography
                    variant="body2"
                    className={classes.installPrivacyText}
                  >
                    <FormattedMessage
                      {...messages.permissionsUninstallDescription}
                      values={{ name }}
                    />
                    {!!data?.dataPrivacyUrl && (
                      <a
                        href={data?.dataPrivacyUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <FormattedMessage {...messages.dataPrivacyLearnMore} />
                      </a>
                    )}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
          <CardSpacer />
          <Box display="flex" justifyContent="space-between" padding={9}>
            <Button variant="secondary" onClick={navigateToAppsList}>
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              <FormattedMessage {...messages.installButton} />
            </Button>
          </Box>
        </Box>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

AppInstallPage.displayName = "AppInstallPage";
export default AppInstallPage;
