import Link from "@dashboard/components/Link";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

export const WarehouseInformationMessage = ({
  isCreate,
  hasVariants,
  hasWarehouses,
  onWarehouseConfigure,
}: {
  isCreate: boolean;
  hasVariants: boolean;
  hasWarehouses: boolean;
  onWarehouseConfigure: () => void;
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

  return (
    !hasWarehouses && (
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
    )
  );
};
