import { useAppNavigation } from "@dashboard/extensions/hooks/useAppNavigation";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { SMTP_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";
import { Box, Spinner, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { notificationsMessages } from "../messages";

/**
 * Opens the installed SMTP app (customer emails). If not installed, sends merchants
 * to Explore Extensions in this Dashboard — not the public App Store.
 */
export const CustomerEmailsRedirectView = (): JSX.Element => {
  const navigate = useNavigator();
  const { navigateToApp } = useAppNavigation();
  const redirected = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(
    function redirectToSmtpApp() {
      if (redirected.current) {
        return;
      }

      redirected.current = true;

      navigateToApp({ identifier: SMTP_APP_IDENTIFIER, replace: true })
        .then(navigated => {
          if (!navigated) {
            navigate(ExtensionsPaths.exploreExtensions, { replace: true });
          }
        })
        // Lookup failure: stay in Dashboard with an error — do not assume “not installed”.
        .catch(() => setFailed(true));
    },
    [navigate, navigateToApp],
  );

  if (failed) {
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
