import {
  TopNavDestinationIcon,
  topNavDestinationMessages,
  TopNavLink,
  TopNavWrapper,
} from "@dashboard/components/AppLayout/TopNav";
import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { deprecationMessages } from "@dashboard/extensions/messages";
import { type AppLogo } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./message";

type Logo = AppLogo | undefined;

interface AppPageNavProps {
  name?: string | undefined | null;
  supportUrl?: string | undefined | null;
  homepageUrl?: string | undefined | null;
  author?: string | undefined | null;
  appId: string;
  appLogoUrl?: string | undefined | null;
  /**
   * Render a destination link only if an URL is provided.
   */
  goBackUrl?: string;
  /**
   * Temporary prop, so the header can be composed with buttons instead hard coding them.
   * Component is used on Manage App page too, so the button should be hidden there
   */
  showMangeAppButton?: boolean;
  /** Tints the header and shows the reason on one line; the header height is fixed. */
  deprecationReason?: string | null;
}

export const AppPageNav = ({
  name,
  supportUrl,
  homepageUrl,
  author,
  appLogoUrl,
  goBackUrl,
  appId,
  showMangeAppButton = true,
  deprecationReason,
}: AppPageNavProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const navigateToManageAppScreen = () => {
    navigate(ExtensionsUrls.resolveEditManifestExtensionUrl(appId));
  };
  const logo = useMemo(
    (): Logo =>
      appLogoUrl
        ? {
            source: appLogoUrl,
          }
        : undefined,
    [appLogoUrl],
  );

  return (
    <TopNavWrapper backgroundColor={deprecationReason ? "warning1" : "default1"}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        __minWidth="0"
      >
        <Box display="flex" gap={2} alignItems="center" flexShrink="0">
          {goBackUrl && (
            <TopNavLink
              to={goBackUrl}
              variant="secondary"
              icon={<TopNavDestinationIcon.extensions />}
              title={intl.formatMessage(topNavDestinationMessages.extensions)}
            />
          )}
          <Box display="flex" gap={4} alignItems="center">
            <AppAvatar size={8} logo={logo} />
            <Box display="flex" flexDirection="column">
              <Text size={5} fontWeight="bold">
                {name}
              </Text>
              <Text size={2} color="default2" textTransform="uppercase">
                {author && (
                  <FormattedMessage defaultMessage="by {author}" id="6SL46U" values={{ author }} />
                )}
              </Text>
            </Box>
          </Box>
        </Box>
        {deprecationReason && (
          <Text
            size={3}
            display="block"
            __flex="1"
            __minWidth="0"
            marginX={6}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            title={deprecationReason}
            data-test-id="app-deprecation-reason"
          >
            <Text size={3} fontWeight="medium">
              <FormattedMessage {...deprecationMessages.inlineLabel} />
            </Text>{" "}
            {deprecationReason}
          </Text>
        )}
      </Box>
      <Box display="flex" gap={1.5} flexShrink="0">
        {showMangeAppButton && (
          <Button
            whiteSpace="nowrap"
            variant="secondary"
            onClick={navigateToManageAppScreen}
            data-test-id="app-settings-button"
          >
            <FormattedMessage
              {...(hasManagedAppsPermission ? messages.manageApp : messages.appSettings)}
            />
          </Button>
        )}
        {supportUrl && (
          <Button variant="secondary" size="medium" href={supportUrl} target="_blank" as="a">
            <FormattedMessage defaultMessage="Support" id="HqRNN8" />
          </Button>
        )}
        {homepageUrl && (
          <Button variant="secondary" size="medium" href={homepageUrl} target="_blank" as="a">
            <FormattedMessage defaultMessage="Homepage" id="rxNddi" />
          </Button>
        )}
      </Box>
    </TopNavWrapper>
  );
};
