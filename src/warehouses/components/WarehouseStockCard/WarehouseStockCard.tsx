import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { messages } from "@dashboard/warehouses/messages";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface WarehouseStockCardProps {
  /** Null when the count could not be loaded, for example without permission. */
  count: number | null;
  loading?: boolean;
}

export const WarehouseStockCard = ({
  count,
  loading = false,
}: WarehouseStockCardProps): ReactNode => {
  if (!loading && count === null) {
    return null;
  }

  return (
    <DetailSettingsCard
      title={<FormattedMessage {...messages.stockTitle} />}
      data-test-id="warehouse-stock"
      intro={
        <Text size={3} color="default2">
          <FormattedMessage {...messages.stockDescription} />
        </Text>
      }
    >
      {loading || count === null ? (
        <Skeleton __height="1.25rem" __width="40%" />
      ) : (
        <Text size={3}>
          <FormattedMessage {...messages.stockCount} values={{ count }} />
        </Text>
      )}
    </DetailSettingsCard>
  );
};

WarehouseStockCard.displayName = "WarehouseStockCard";
