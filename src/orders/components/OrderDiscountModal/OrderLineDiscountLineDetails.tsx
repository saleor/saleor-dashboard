import styles from "@dashboard/components/Modal/DashboardModal.module.css";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { VariantThumbnail } from "../OrderLineMetadataDialog/OrderLineDetails/VariantThumbnail";

interface OrderLineDiscountLineDetailsProps {
  productName: string;
  variantName?: string;
  productSku?: string | null;
  quantity: number;
  thumbnailUrl?: string | null;
}

export const OrderLineDiscountLineDetails = ({
  productName,
  variantName,
  productSku,
  quantity,
  thumbnailUrl,
}: OrderLineDiscountLineDetailsProps) => (
  <Box display="flex" gap={4} alignItems="center" overflow="hidden" __minWidth={0}>
    <VariantThumbnail src={thumbnailUrl ?? undefined} loading={false} />
    <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
      <Text size={2} color="default2" className={styles.truncatedText}>
        {productName}
        {variantName && ` · ${variantName}`}
      </Text>
      <Text size={2} color="default2" className={styles.truncatedText}>
        {productSku && (
          <>
            <FormattedMessage defaultMessage="SKU" id="k4brJy" />
            {`: ${productSku} · `}
          </>
        )}
        <FormattedMessage defaultMessage="Qty" id="7gXPhB" />
        {`: ${quantity}`}
      </Text>
    </Box>
  </Box>
);
