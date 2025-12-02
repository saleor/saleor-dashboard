import { CardTitle } from "@dashboard/components/CardTitle/CardTitle";
import { FormatDate } from "@dashboard/components/Date";
import { FulfillmentStatus } from "@dashboard/graphql";
import { Box, Text, vars } from "@saleor/macaw-ui-next";
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
  backgroundColor?: keyof typeof vars.colors.background;
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
  createdDate?: string;
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
  backgroundColor,
}: OrderCardTitleProps): JSX.Element => {
  const intl = useIntl();

  return (
    <CardTitle
      toolbar={toolbar}
      className={className}
      backgroundColor={backgroundColor}
      title={
        <Box>
          <Box display="flex" alignItems="center">
            {createdDate && (
              <Text color="default2" size={2}>
                <FormatDate date={createdDate} />
              </Text>
            )}
            {warehouseName && warehouseId && (
              <WarehouseInfo warehouseName={warehouseName} warehouseId={warehouseId} />
            )}
            {trackingNumber && <TrackingNumberDisplay trackingNumber={trackingNumber} />}
          </Box>
          <Box display="flex" alignItems="center" marginTop={1}>
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
