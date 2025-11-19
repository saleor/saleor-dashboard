import DefaultCardTitle from "@dashboard/components/CardTitle";
import { FulfillmentStatus } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { StatusIndicator } from "./StatusIndicator";
import { TrackingNumberDisplay } from "./TrackingNumberDisplay";
import { getOrderTitleMessage } from "./utils";
import { WarehouseInfo } from "./WarehouseInfo";

export type CardTitleStatus = FulfillmentStatus | "unfulfilled";

type BaseOrderCardTitleProps = {
  status?: CardTitleStatus;
  toolbar?: React.ReactNode;
  withStatus?: boolean;
  className?: string;
};

type OrderCardTitleWithWarehouseProps = BaseOrderCardTitleProps & {
  warehouseName: string;
  warehouseId: string;
  createdDate: string;
  trackingNumber?: string;
};

type OrderCardTitleWithoutWarehouseProps = BaseOrderCardTitleProps & {
  warehouseName?: never;
  warehouseId?: never;
  createdDate?: never;
  trackingNumber?: string;
};

export type OrderCardTitleProps =
  | OrderCardTitleWithWarehouseProps
  | OrderCardTitleWithoutWarehouseProps;

export const OrderCardTitle = ({
  status,
  warehouseName,
  withStatus = false,
  toolbar,
  createdDate,
  className,
  trackingNumber,
  warehouseId,
}: OrderCardTitleProps): JSX.Element => {
  const intl = useIntl();

  return (
    <DefaultCardTitle
      toolbar={toolbar}
      className={className}
      title={
        <Box>
          <Box display="flex" alignItems="center">
            {warehouseName && warehouseId && createdDate && (
              <WarehouseInfo
                warehouseName={warehouseName}
                warehouseId={warehouseId}
                createdDate={createdDate}
              />
            )}
            {trackingNumber && <TrackingNumberDisplay trackingNumber={trackingNumber} />}
          </Box>
          <Box display="flex" alignItems="center">
            <Text size={6} fontWeight="medium">
              {intl.formatMessage(getOrderTitleMessage(status))}
            </Text>
            {withStatus && <StatusIndicator status={status} />}
          </Box>
        </Box>
      }
    />
  );
};
