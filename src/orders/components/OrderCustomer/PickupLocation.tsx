import {
  getAddressCityLine,
  getAddressCountryLine,
  getAddressStreetLine,
} from "@dashboard/components/ReadonlyAddress/formatAddressLines";
import { type ReadonlyAddressData } from "@dashboard/components/ReadonlyAddress/types";
import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type MessageDescriptor, useIntl } from "react-intl";

import { orderCustomerMessages } from "./messages";

interface PickupLocationProps {
  name: string | null | undefined;
  address: ReadonlyAddressData | null | undefined;
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum | null | undefined;
}

const stockRuleMessages: Partial<Record<WarehouseClickAndCollectOptionEnum, MessageDescriptor>> = {
  [WarehouseClickAndCollectOptionEnum.LOCAL]: orderCustomerMessages.pickupStockLocal,
  [WarehouseClickAndCollectOptionEnum.ALL]: orderCustomerMessages.pickupStockAll,
};

// The address is the warehouse's, copied onto the order at checkout. Its contact
// name is left out so it is not mistaken for the customer collecting the order.
const getPickupLocationAddressLines = (
  address: ReadonlyAddressData | null | undefined,
): string[] => {
  if (!address) {
    return [];
  }

  return [
    address.companyName,
    getAddressStreetLine(address),
    getAddressCityLine(address),
    getAddressCountryLine(address),
    address.phone,
  ].filter((line): line is string => !!line);
};

// Copies the location as shown: its name and address, without the warehouse
// contact name and without the stock-rule explanation.
export const formatPickupLocationForClipboard = ({
  name,
  address,
}: {
  name: string | null | undefined;
  address: ReadonlyAddressData | null | undefined;
}): string => [name, ...getPickupLocationAddressLines(address)].filter(Boolean).join("\n");

export const PickupLocation = ({ name, address, clickAndCollectOption }: PickupLocationProps) => {
  const intl = useIntl();
  const stockRule = clickAndCollectOption ? stockRuleMessages[clickAndCollectOption] : undefined;
  const addressLines = getPickupLocationAddressLines(address);

  return (
    <Box display="flex" flexDirection="column" data-test-id="pickup-location">
      {name && (
        <Text size={4} fontWeight="medium" color="default1" data-test-id="pickup-location-name">
          {name}
        </Text>
      )}
      {stockRule && (
        <Text size={3} color="default2" data-test-id="pickup-location-stock-rule">
          {intl.formatMessage(stockRule)}
        </Text>
      )}
      {addressLines.length > 0 && (
        <Box
          as="address"
          display="flex"
          flexDirection="column"
          gap={0.5}
          marginTop={name || stockRule ? 1 : 0}
          __fontStyle="normal"
        >
          {addressLines.map((line, index) => (
            <Text key={index} size={4} color="default1">
              {line}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
