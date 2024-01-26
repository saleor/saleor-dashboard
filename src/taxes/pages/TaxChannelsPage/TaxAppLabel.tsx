import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppUrls } from "@dashboard/apps/urls";
import { TaxStrategyChoicesQuery } from "@dashboard/graphql";
import { Box, ExternalLinkIcon, Text } from "@saleor/macaw-ui-next";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
  app: TaxStrategyChoicesQuery["shop"]["availableTaxApps"][number];
}

export const TaxAppLabel: React.FC<Props> = ({ app }) => {
  const logo = app.brand?.logo?.default
    ? { source: app.brand?.logo?.default }
    : undefined;

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
            <Text>
              <FormattedMessage
                defaultMessage="Use app: {name}"
                id="W2OIhn"
                values={{
                  name: <Text variant="bodyStrong">{app.name}</Text>,
                }}
              />
            </Text>
            {app.version && (
              <Text variant="body" color="default2">
                {`v${app.version}`}
              </Text>
            )}
          </Box>
          <Text variant="caption" color="default2">
            <FormattedMessage
              defaultMessage="Created at: {date}"
              id="XFKV5Z"
              values={{
                date: moment(app.created).format("YYYY-MM-DD HH:mm"),
              }}
            />
          </Text>
        </Box>
      </Box>
      <Box
        as="a"
        href={AppUrls.resolveAppDetailsUrl(app.id)}
        target="_blank"
        textDecoration="underline"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Text color="default2" variant="caption" ellipsis __maxWidth="150px">
          {app.identifier}
        </Text>
        <ExternalLinkIcon size="small" color="default2" />
      </Box>
    </Box>
  );
};

export const FlatTaxRateLabel: React.FC = () => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" __height="40px">
      <Text>
        {intl.formatMessage({
          defaultMessage: "Use flat tax rate",
          id: "zSDfq0",
        })}
      </Text>
    </Box>
  );
};
