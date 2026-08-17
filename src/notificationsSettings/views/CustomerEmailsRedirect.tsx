import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { findInstalledAppByIdentifier } from "@dashboard/extensions/utils/findInstalledAppByIdentifier";
import { resolveInstalledAppHref } from "@dashboard/extensions/utils/resolveInstalledAppHref";
import { useInstalledAppsQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { SMTP_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Spinner, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";

import { notificationsMessages } from "../messages";

/**
 * Opens the installed SMTP app (customer emails). If not installed, sends merchants
 * to Explore Extensions in this Dashboard — not the public App Store.
 */
export const CustomerEmailsRedirectView = (): JSX.Element => {
  const navigate = useNavigator();
  const redirected = useRef(false);
  // Search narrows the page so we don’t miss SMTP when many apps are installed.
  const { data, loading, error } = useInstalledAppsQuery({
    displayLoader: true,
    variables: {
      first: 25,
      filter: { search: "smtp" },
    },
  });

  useEffect(
    function redirectToSmtpApp() {
      if (loading || redirected.current) {
        return;
      }

      // Query failure: stay in Dashboard with an error — do not assume “not installed”.
      if (error || data?.apps == null) {
        return;
      }

      redirected.current = true;

      const installedApps = mapEdgesToItems(data.apps) ?? [];
      const smtpApp = findInstalledAppByIdentifier(installedApps, SMTP_APP_IDENTIFIER);

      if (smtpApp) {
        navigate(
          resolveInstalledAppHref({
            id: smtpApp.id,
            type: smtpApp.type,
            isActive: smtpApp.isActive,
            appUrl: smtpApp.appUrl,
          }),
          { replace: true },
        );

        return;
      }

      navigate(ExtensionsPaths.exploreExtensions, { replace: true });
    },
    [data?.apps, error, loading, navigate],
  );

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding={12}>
        <Text size={3} color="default2">
          <FormattedMessage {...notificationsMessages.customerEmailsRedirectFailed} />
        </Text>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" padding={12}>
      <Spinner />
    </Box>
  );
};
