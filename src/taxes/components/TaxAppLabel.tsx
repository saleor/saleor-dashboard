import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { Box, Text } from "@saleor/macaw-ui-next";
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

export const TaxAppLabel: React.FC<TaxAppLabelProps> = ({ name, logoUrl, version }) => {
  const logo = logoUrl ? { source: logoUrl } : undefined;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AppAvatar logo={logo} size={4} />
      {name && (
        <Text>
          <FormattedMessage
            defaultMessage="Use app: {name}"
            id="W2OIhn"
            values={{
              name: (
                <Text size={4} fontWeight="bold">
                  {name}
                </Text>
              ),
            }}
          />
        </Text>
      )}
      {version && <Text color="default2">{`v${version}`}</Text>}
    </Box>
  );
};
