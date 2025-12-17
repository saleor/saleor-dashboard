import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { orderTitleMessages } from "./messages";
import { UnderlineLink } from "./UnderlineLink";

interface WarehouseInfoProps {
  warehouseName: string;
  warehouseId: string;
}

export const WarehouseInfo = ({ warehouseName, warehouseId }: WarehouseInfoProps): JSX.Element => {
  const intl = useIntl();

  return (
    <Text
      color="default2"
      size={2}
      ellipsis
      title={warehouseName}
      style={{ maxWidth: "250px" }}
      as="span"
    >
      {", "}
      {intl.formatMessage(orderTitleMessages.fulfilledFromWarehouse, {
        warehouseName: (
          <UnderlineLink to={warehouseUrl(warehouseId)}>{warehouseName}</UnderlineLink>
        ),
      })}
    </Text>
  );
};
