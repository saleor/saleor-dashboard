import { appsListUrl } from "@dashboard/apps/urls";
import { TopNavLink, TopNavWrapper } from "@dashboard/components/AppLayout";
import { AppQuery } from "@dashboard/graphql";
import { AppAvatar } from "@dashboard/new-apps/components/AppAvatar/AppAvatar";
import { GitHub, OfflineBoltOutlined } from "@material-ui/icons";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface AppPageNavProps {
  name: AppQuery["app"]["name"];
  supportUrl: AppQuery["app"]["supportUrl"];
  homepageUrl: AppQuery["app"]["homepageUrl"];
}

export const AppPageNav: React.FC<AppPageNavProps> = ({
  name,
  supportUrl,
  homepageUrl,
}) => (
  <TopNavWrapper>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Box display="flex" gap={7} alignItems="center">
        <TopNavLink to={appsListUrl()} />
        <Box display="flex" gap={5} alignItems="center">
          <AppAvatar size="large" />
          <Text variant="heading">{name}</Text>
        </Box>
      </Box>
      <Box display="flex" gap={4}>
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
        <Button
          variant="secondary"
          size="medium"
          onClick={() => {
            window.open(homepageUrl, "_blank");
          }}
        >
          <OfflineBoltOutlined />
          <FormattedMessage defaultMessage="Request a feature" id="tDlWb6" />
        </Button>
      </Box>
    </Box>
  </TopNavWrapper>
);
