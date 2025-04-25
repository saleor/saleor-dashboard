import plusIcon from "@assets/images/plus-icon.svg";
import saleorLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import saleorLogoLightMode from "@assets/images/sidebar-default-logo.png";
import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import Hr from "@dashboard/components/Hr";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { AppFetchMutation, AppInstallMutation } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { useTheme } from "@dashboard/theme";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
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
          <DashboardCard>
            <DashboardCard.Header>
              <DashboardCard.Title data-test-id="app-installation-page-header">
                {loading ? (
                  <Skeleton __width="20ch" height={6} />
                ) : (
                  intl.formatMessage(messages.title, { name })
                )}
              </DashboardCard.Title>
            </DashboardCard.Header>
            <DashboardCard.Content className={classes.installCard}>
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
                {loading ? (
                  <Box width={12} height={12} backgroundColor="default1">
                    <Skeleton width={12} height={12} />
                  </Box>
                ) : (
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
                )}
              </div>
            </DashboardCard.Content>
          </DashboardCard>

          <CardSpacer />

          <DashboardCard>
            <DashboardCard.Header>
              <DashboardCard.Title>
                {intl.formatMessage(messages.permissionsTitle)}
              </DashboardCard.Title>
            </DashboardCard.Header>
            <DashboardCard.Content>
              {loading ? (
                <>
                  <Skeleton __width="30%" height={6} marginBottom={2} />

                  <Skeleton height={4} __width="150px" marginBottom={2} />
                  <Skeleton height={4} __width="120px" />

                  <Hr className={classes.installSpacer} />

                  <Skeleton height={3} __width="50%" />
                </>
              ) : (
                <>
                  <Text className={classes.installPermissionTitle}>
                    <FormattedMessage {...messages.permissionsInstallDescription} />
                  </Text>

                  {!!data?.permissions?.length && (
                    <ul className={classes.permissionsContainer}>
                      {data?.permissions?.map(perm => <li key={perm.code}>{perm.name}</li>)}
                    </ul>
                  )}
                  <Hr className={classes.installSpacer} />

                  <Text className={classes.installPrivacyText}>
                    <FormattedMessage
                      {...messages.permissionsUninstallDescription}
                      values={{ name }}
                    />
                    {!!data?.dataPrivacyUrl && (
                      <a href={data?.dataPrivacyUrl} rel="noopener noreferrer" target="_blank">
                        <FormattedMessage {...messages.dataPrivacyLearnMore} />
                      </a>
                    )}
                  </Text>
                </>
              )}
            </DashboardCard.Content>
          </DashboardCard>

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
