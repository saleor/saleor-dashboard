import { warehouseUrl } from "@dashboard/warehouses/urls";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { orderTitleMessages } from "./messages";
import { UnderlineLink } from "./UnderlineLink";

interface WarehouseInfoProps {
  warehouseName: string;
  warehouseId: string;
  createdDate: string;
}

export const WarehouseInfo = ({
  warehouseName,
  warehouseId,
  createdDate,
}: WarehouseInfoProps): JSX.Element => {
  const intl = useIntl();

  return (
    <Text color="default2" size={2} marginRight={1}>
      {intl.formatMessage(orderTitleMessages.fulfilledFrom, {
        warehouseName: (
          <UnderlineLink to={warehouseUrl(warehouseId)}>{warehouseName}</UnderlineLink>
        ),
        fulfillmentDate: intl.formatDate(createdDate, {
          day: "numeric",
          month: "short",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })}
    </Text>
  );
};
