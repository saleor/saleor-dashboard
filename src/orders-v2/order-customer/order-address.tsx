import { AddressFragment } from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { ClipboardCopyIcon } from "../clipboard-copy-icon";

const prepareAddressForClipboard = (address: AddressFragment) => {
  return `
    ${address.firstName} ${address.lastName}
    ${address.phone}
    ${address.companyName}
    ${address.streetAddress1} ${address.streetAddress2}
    ${address.postalCode} ${address.city}
    ${address.countryArea} ${address.country.country}
  `.trim();
};

export const OrderAddress = ({
  address,
  type,
}: {
  address: AddressFragment;
  type: "shipping" | "billing";
}) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text color="default2">
          {intl.formatMessage(
            {
              defaultMessage:
                "{type, select, shipping {Shipping Address} billing {Billing Address} other {}} ",
              id: "MpkCXQ",
            },
            { type },
          )}
        </Text>
        <Button variant="secondary">
          {intl.formatMessage({
            defaultMessage: "Edit",
            id: "wEQDC6",
          })}
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="flex-end">
        <Box display="flex" flexDirection="column" gap={1}>
          <Text fontWeight="medium">
            {intl.formatMessage(
              {
                defaultMessage: "{firstName} {lastName}",
                id: "1gzck6",
              },
              { firstName: address.firstName, lastName: address.lastName },
            )}
          </Text>
          <Text fontWeight="medium">{address.phone}</Text>
          <Text fontWeight="medium">{address.companyName}</Text>
          <Text fontWeight="medium">
            {intl.formatMessage(
              {
                defaultMessage: "{streetAddress1} {streetAddress2}",
                id: "QQT/md",
              },
              { streetAddress1: address.streetAddress1, streetAddress2: address.streetAddress2 },
            )}
          </Text>
          <Text fontWeight="medium">
            {intl.formatMessage(
              {
                defaultMessage: "{postalCode} {city}",
                id: "jLAXqy",
              },
              { postalCode: address.postalCode, city: address.city },
            )}
          </Text>
          <Text fontWeight="medium">
            {intl.formatMessage(
              {
                defaultMessage: "{countryArea} {country}",
                id: "U9rdJc",
              },
              { countryArea: address.countryArea, country: address.country.country },
            )}
          </Text>
        </Box>

        <Button
          variant="tertiary"
          size="small"
          icon={<ClipboardCopyIcon hasBeenClicked={copied} />}
          onClick={() => copy(prepareAddressForClipboard(address))}
        />
      </Box>
    </Box>
  );
};
