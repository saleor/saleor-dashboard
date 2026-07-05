import styles from "@dashboard/components/Modal/DashboardModal.module.css";
import { type OrderLineMetadataDetailsFragment } from "@dashboard/graphql";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { VariantThumbnail } from "./VariantThumbnail";

interface OrderLineDetailsProps {
  loading: boolean;
  data: OrderLineMetadataDetailsFragment | null | undefined;
}

export const OrderLineDetails = ({ loading, data }: OrderLineDetailsProps) => (
  <Box display="flex" gap={4} alignItems="center" overflow="hidden" __minWidth={0}>
    <VariantThumbnail src={data?.thumbnail?.url} loading={loading} />
    <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
      {loading ? (
        <>
          <Skeleton width={52} height={5} />
          <Skeleton width={40} height={5} />
        </>
      ) : (
        <>
          <Text size={2} color="default2" className={styles.truncatedText}>
            {data?.productName}
            {data?.variant?.name && ` · ${data.variant.name}`}
          </Text>
          <Text size={2} color="default2" className={styles.truncatedText}>
            {data?.productSku && (
              <>
                <FormattedMessage defaultMessage="SKU" id="k4brJy" />
                {`: ${data.productSku} · `}
              </>
            )}
            <FormattedMessage defaultMessage="Qty" id="7gXPhB" />
            {`: ${data?.quantity ?? "-"}`}
          </Text>
        </>
      )}
    </Box>
  </Box>
);
