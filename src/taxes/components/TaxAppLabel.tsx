import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { Box, Text } from "@saleor/macaw-ui-next";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";

interface TaxAppLabelProps {
  name: string | null;
  logoUrl: string | undefined;
  created: string | null;
  id: string;
}

export const TaxAppLabel: React.FC<TaxAppLabelProps> = ({ name, logoUrl, created }) => {
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
      {created && (
        <Text size={2} color="default2">
          ({moment(created).format("YYYY-MM-DD")})
        </Text>
      )}
    </Box>
  );
};
