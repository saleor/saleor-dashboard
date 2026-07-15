import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { orderTitleMessages } from "./messages";
import { UnderlineLink } from "./UnderlineLink";

type WarehouseInfoVariant = "fulfilledFrom" | "shippedFrom" | "restockedTo";

interface WarehouseInfoProps {
  warehouseName: string;
  warehouseId: string;
  separator?: string;
  variant?: WarehouseInfoVariant;
}

const warehouseMessageByVariant = {
  fulfilledFrom: orderTitleMessages.fulfilledFromWarehouse,
  shippedFrom: orderTitleMessages.shippedFromWarehouse,
  restockedTo: orderTitleMessages.restockedToWarehouse,
} as const;

export const WarehouseInfo = ({
  warehouseName,
  warehouseId,
  separator = ", ",
  variant = "fulfilledFrom",
}: WarehouseInfoProps): JSX.Element => {
  const intl = useIntl();
  const message = warehouseMessageByVariant[variant];

  return (
    <Text
      color="default2"
      size={2}
      ellipsis
      title={warehouseName}
      style={{ maxWidth: "250px" }}
      as="span"
    >
      {separator}
      {intl.formatMessage(message, {
        warehouseName: (
          <UnderlineLink to={warehouseUrl(warehouseId)}>{warehouseName}</UnderlineLink>
        ),
      })}
    </Text>
  );
};
