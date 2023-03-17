import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNavLink, TopNavWrapper } from "@dashboard/components/AppLayout";
import { LinkState } from "@dashboard/components/Link";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

interface AppPageNavProps {
  name: string | undefined | null;
  supportUrl: string | undefined | null;
  homepageUrl: string | undefined | null;
}

export const AppPageNav: React.FC<AppPageNavProps> = ({
  name,
  supportUrl,
  homepageUrl,
}) => {
  const location = useLocation<LinkState>();
  const goBackLink = location.state?.from ?? AppUrls.resolveAppListUrl();

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
                {/* TODO: pass author here when cache expires */}
                <FormattedMessage
                  defaultMessage="by {author}"
                  id="6SL46U"
                  values={{ author: "saleor commerce" }}
                />
              </Text>
            </Box>
          </Box>
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
            <FormattedMessage defaultMessage="Support" id="HqRNN8" />
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
            <FormattedMessage defaultMessage="Homepage" id="rxNddi" />
          </Button>
        )}
      </Box>
    </TopNavWrapper>
  );
};
