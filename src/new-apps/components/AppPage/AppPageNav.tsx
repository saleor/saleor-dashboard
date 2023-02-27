import { appsListUrl } from "@dashboard/apps/urls";
import { TopNavLink, TopNavWrapper } from "@dashboard/components/AppLayout";
import { LinkState } from "@dashboard/components/Link";
import { AppQuery } from "@dashboard/graphql";
import { AppAvatar } from "@dashboard/new-apps/components/AppAvatar/AppAvatar";
import { GitHub, OfflineBoltOutlined } from "@material-ui/icons";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

interface AppPageNavProps {
  name: AppQuery["app"]["name"];
  supportUrl: AppQuery["app"]["supportUrl"];
  homepageUrl: AppQuery["app"]["homepageUrl"];
}

export const AppPageNav: React.FC<AppPageNavProps> = ({
  name,
  supportUrl,
  homepageUrl,
}) => {
  const location = useLocation<LinkState>();
  const goBackLink = location.state?.from ?? appsListUrl();

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
            <AppAvatar size="medium" />
            <Text variant="heading">{name}</Text>
          </Box>
        </Box>
        <Box display="flex" gap={4}>
          {supportUrl && (
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                window.open(supportUrl, "_blank");
              }}
            >
              <GitHub />
              <FormattedMessage defaultMessage="Repository" id="UxeJFE" />
            </Button>
          )}
          {homepageUrl && (
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                window.open(homepageUrl, "_blank");
              }}
            >
              <OfflineBoltOutlined />
              <FormattedMessage
                defaultMessage="Request a feature"
                id="tDlWb6"
              />
            </Button>
          )}
        </Box>
      </Box>
    </TopNavWrapper>
  );
};
