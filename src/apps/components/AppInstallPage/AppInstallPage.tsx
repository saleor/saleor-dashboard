import plusIcon from "@assets/images/plus-icon.svg";
import saleorLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import saleorLogoLightMode from "@assets/images/sidebar-default-logo.png";
import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Hr from "@dashboard/components/Hr";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Skeleton from "@dashboard/components/Skeleton";
import { AppFetchMutation, AppInstallMutation } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { useTheme } from "@dashboard/theme";
import { Card, CardContent, CircularProgress, Typography } from "@material-ui/core";
import { Box, Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";
import { useStyles } from "./styles";

export interface AppInstallPageProps {
  data: NonNullable<AppFetchMutation["appFetchManifest"]>["manifest"];
  loading: boolean;
  navigateToAppsList: () => void;
  onSubmit: () => SubmitPromise<NonNullable<AppInstallMutation["appInstall"]>["errors"]>;
}

export const AppInstallPage: React.FC<AppInstallPageProps> = ({
  data,
  loading,
  navigateToAppsList,
  onSubmit,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const { theme } = useTheme();
  const getSaleorLogoUrl = () => {
    switch (theme) {
      case "defaultLight":
        return saleorLogoLightMode;
      case "defaultDark":
        return saleorLogoDarkMode;
      default:
        throw new Error("Invalid theme mode, should not happen.");
    }
  };
  const name = data?.name || "";

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
      <DetailPageLayout.Content>
        <Box paddingY={6}>
          <CardSpacer />
          <Card>
            <CardTitle
              title={loading ? <Skeleton /> : intl.formatMessage(messages.title, { name })}
              data-test-id="app-installation-page-header"
            />
            <CardContent className={classes.installCard}>
              {loading ? (
                <CircularProgress />
              ) : (
                <div className={classes.installAppContainer}>
                  <Box
                    width={12}
                    height={12}
                    display="flex"
                    placeItems="center"
                    borderRadius={2}
                    overflow="hidden"
                  >
                    <img src={getSaleorLogoUrl()} alt="Saleor" />
                  </Box>
                  <img src={plusIcon} alt="" />
                  <AppAvatar
                    size={12}
                    logo={
                      data?.brand?.logo.default
                        ? {
                            source: data?.brand?.logo.default,
                          }
                        : undefined
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <CardSpacer />
          <Card>
            {!loading && <CardTitle title={intl.formatMessage(messages.permissionsTitle)} />}
            <CardContent>
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  <Typography className={classes.installPermissionTitle}>
                    <FormattedMessage {...messages.permissionsInstallDescription} />
                  </Typography>
                  {!!data?.permissions?.length && (
                    <ul className={classes.permissionsContainer}>
                      {data?.permissions?.map(perm => <li key={perm.code}>{perm.name}</li>)}
                    </ul>
                  )}
                  <Hr className={classes.installSpacer} />

                  <Typography variant="body2" className={classes.installPrivacyText}>
                    <FormattedMessage
                      {...messages.permissionsUninstallDescription}
                      values={{ name }}
                    />
                    {!!data?.dataPrivacyUrl && (
                      <a href={data?.dataPrivacyUrl} rel="noopener noreferrer" target="_blank">
                        <FormattedMessage {...messages.dataPrivacyLearnMore} />
                      </a>
                    )}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
          <CardSpacer />
          <Box display="flex" justifyContent="space-between" padding={6}>
            <Button variant="secondary" onClick={navigateToAppsList}>
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
            <Button variant="primary" onClick={onSubmit} data-test-id="install-app-button">
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
