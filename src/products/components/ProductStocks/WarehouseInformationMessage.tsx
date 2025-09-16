import Link from "@dashboard/components/Link";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface WarehouseInformationMessageProps {
  isCreate: boolean;
  hasVariants: boolean;
  hasStocks: boolean;
  onWarehouseConfigure: () => void;
}

export const WarehouseInformationMessage: React.FC<WarehouseInformationMessageProps> = ({
  isCreate,
  hasVariants,
  hasStocks,
  onWarehouseConfigure,
}) => {
  if (isCreate) {
    const message = hasVariants
      ? messages.warehouseMessageVariantOnCreate
      : messages.warehouseMessageProductOnCreate;

    return (
      <Text color="default2">
        <FormattedMessage {...message} />
      </Text>
    );
  }

  if (hasStocks) {
    return null;
  }

  return (
    <Text color="default2">
      {hasVariants ? (
        <FormattedMessage
          {...messages.configureWarehouseForVariant}
          values={{
            a: chunks => <Link onClick={onWarehouseConfigure}>{chunks}</Link>,
          }}
        />
      ) : (
        <FormattedMessage
          {...messages.configureWarehouseForProduct}
          values={{
            a: chunks => <Link onClick={onWarehouseConfigure}>{chunks}</Link>,
          }}
        />
      )}
    </Text>
  );
};
