import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppLogo } from "@dashboard/apps/types";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNavLink, TopNavWrapper } from "@dashboard/components/AppLayout";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";

interface AppPageNavProps {
  name?: string | undefined | null;
  supportUrl?: string | undefined | null;
  homepageUrl?: string | undefined | null;
  author?: string | undefined | null;
  appId: string;
  appLogoUrl?: string | undefined | null;
  goBackUrl: string;
  /**
   * Temporary prop, so the header can be composed with buttons instead hard coding them.
   * Component is used on Manage App page too, so the button should be hidden there
   */
  showMangeAppButton?: boolean;
}

export const AppPageNav: React.FC<AppPageNavProps> = ({
  name,
  supportUrl,
  homepageUrl,
  author,
  appLogoUrl,
  goBackUrl,
  appId,
  showMangeAppButton = true,
}) => {
  const navigate = useNavigator();

  const navigateToManageAppScreen = () => {
    navigate(AppUrls.resolveAppDetailsUrl(appId));
  };

  const logo = useMemo(
    (): AppLogo | undefined =>
      appLogoUrl
        ? {
            source: appLogoUrl,
          }
        : undefined,
    [appLogoUrl],
  );

  return (
    <TopNavWrapper>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" gap={4} alignItems="center">
          <TopNavLink to={goBackUrl} variant="tertiary" />
          <Box display="flex" gap={2} alignItems="center">
            <AppAvatar size={8} logo={logo} />
            <Box display="flex" flexDirection="column">
              <Text variant="heading">{name}</Text>
              <Text
                variant="caption"
                color="textNeutralSubdued"
                textTransform="uppercase"
              >
                {author && (
                  <FormattedMessage
                    defaultMessage="by {author}"
                    id="6SL46U"
                    values={{ author }}
                  />
                )}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" gap={1.5}>
        {showMangeAppButton && (
          <Button
            whiteSpace="nowrap"
            variant="secondary"
            onClick={navigateToManageAppScreen}
            data-test-id="app-settings-button"
          >
            <FormattedMessage
              defaultMessage="Manage app"
              id="LwX0Ug"
              description="Button with Manage app label"
            />
          </Button>
        )}
        {supportUrl && (
          <Button
            variant="secondary"
            size="medium"
            href={supportUrl}
            target="_blank"
            as="a"
          >
            <FormattedMessage defaultMessage="Support" id="HqRNN8" />
          </Button>
        )}
        {homepageUrl && (
          <Button
            variant="secondary"
            size="medium"
            href={homepageUrl}
            target="_blank"
            as="a"
          >
            <FormattedMessage defaultMessage="Homepage" id="rxNddi" />
          </Button>
        )}
      </Box>
    </TopNavWrapper>
  );
};
