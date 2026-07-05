import { FormatDate } from "@dashboard/components/Date/FormatDate";
import { type FulfillmentStatus } from "@dashboard/graphql";
import { Box, Text, type vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import styles from "./OrderCardTitle.module.css";
import { StatusIndicator } from "./StatusIndicator";
import { TrackingNumberDisplay } from "./TrackingNumberDisplay";
import { getOrderTitleMessage } from "./utils";
import { WarehouseInfo } from "./WarehouseInfo";

export type CardTitleStatus = FulfillmentStatus | "unfulfilled" | "draft";

type BaseOrderCardTitleProps = {
  status?: CardTitleStatus;
  toolbar?: ReactNode;
  withStatus?: boolean;
  className?: string;
  backgroundColor?: keyof typeof vars.colors.background;
  hasToolbarMenu?: boolean;
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
  backgroundColor = "default1",
  hasToolbarMenu = false,
}: OrderCardTitleProps): JSX.Element => {
  const intl = useIntl();
  const hasEyebrow = Boolean(createdDate || (warehouseName && warehouseId) || trackingNumber);

  return (
    <Box
      className={clsx(styles.header, hasToolbarMenu && styles.headerToolbarMenuRight, className)}
      backgroundColor={backgroundColor}
    >
      {hasEyebrow && (
        <Box className={styles.eyebrow}>
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
      )}
      <Box className={clsx(styles.titleRow, hasEyebrow && styles.titleRowWithEyebrow)}>
        <Box className={styles.title}>
          <Text size={6} fontWeight="medium">
            {intl.formatMessage(getOrderTitleMessage(status))}
          </Text>
          {withStatus && <StatusIndicator status={status} />}
        </Box>
        {toolbar && <Box className={styles.toolbar}>{toolbar}</Box>}
      </Box>
    </Box>
  );
};
