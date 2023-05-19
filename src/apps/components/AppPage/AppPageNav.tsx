import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNavLink, TopNavWrapper } from "@dashboard/components/AppLayout";
import { LinkState } from "@dashboard/components/Link";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

interface AppPageNavProps {
  name: string | undefined | null;
  supportUrl: string | undefined | null;
  homepageUrl: string | undefined | null;
  author: string | undefined | null;
  appId: string;
}

export const AppPageNav: React.FC<AppPageNavProps> = ({
  name,
  supportUrl,
  homepageUrl,
  author,
  appId,
}) => {
  const location = useLocation<LinkState>();
  const goBackLink = location.state?.from ?? AppUrls.resolveAppListUrl();
  const navigate = useNavigator();

  const navigateToManageAppScreen = () => {
    navigate(AppUrls.resolveAppDetailsUrl(appId));
  };

  return (
    <TopNavWrapper>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex" gap={7} alignItems="center">
          <TopNavLink to={goBackLink} variant="tertiary" />
          <Box display="flex" gap={5} alignItems="center">
            <AppAvatar />
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
      <Box display="flex" gap={4}>
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
