import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppUrls } from "@dashboard/apps/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, ExternalLinkIcon, Text } from "@saleor/macaw-ui-next";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";

interface TaxAppLabelProps {
  name: string | null;
  logoUrl: string | undefined;
  created: string | null;
  version: string | null;
  id: string;
  identifier: string | null;
}

export const TaxAppLabel: React.FC<TaxAppLabelProps> = ({
  name,
  logoUrl,
  created,
  version,
  id,
  identifier,
}) => {
  const logo = logoUrl ? { source: logoUrl } : undefined;

  const navigate = useNavigator();

  const navigateToAppScreen = () => {
    navigate(AppUrls.resolveAppDetailsUrl(id));
  };

  return (
    <Box
      gap={4}
      alignItems="center"
      display="grid"
      width="100%"
      __gridTemplateColumns="1fr auto"
    >
      <Box display="flex" alignItems="center" gap={3}>
        <AppAvatar logo={logo} />
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            {name && (
              <Text>
                <FormattedMessage
                  defaultMessage="Use app: {name}"
                  id="W2OIhn"
                  values={{
                    name: <Text variant="bodyStrong">{name}</Text>,
                  }}
                />
              </Text>
            )}
            {version && (
              <Text variant="body" color="default2">
                {`v${version}`}
              </Text>
            )}
          </Box>
          {created && (
            <Text variant="caption" color="default2">
              <FormattedMessage
                defaultMessage="Created at: {date}"
                id="XFKV5Z"
                values={{
                  date: moment(created).format("YYYY-MM-DD HH:mm"),
                }}
              />
            </Text>
          )}
        </Box>
      </Box>
      <Button onClick={navigateToAppScreen} variant="tertiary">
        <Box display="flex" alignItems="center" gap={1}>
          {identifier && (
            <Text
              color="default2"
              variant="body"
              ellipsis
              __maxWidth="150px"
              textDecoration="underline"
            >
              {identifier}
            </Text>
          )}
          <ExternalLinkIcon size="small" color="default2" />
        </Box>
      </Button>
    </Box>
  );
};
