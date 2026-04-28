import styles from "@dashboard/components/Modal/DashboardModal.module.css";
import { type OrderLineMetadataDetailsFragment } from "@dashboard/graphql";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { VariantThumbnail } from "./VariantThumbnail";

export const OrderLineDetails = ({
  loading,
  data,
}: {
  loading: boolean;
  data: OrderLineMetadataDetailsFragment | null | undefined;
}) => (
  <Box display="flex" gap={4} alignItems="center" overflow="hidden" __minWidth={0}>
    <VariantThumbnail src={data?.thumbnail?.url} loading={loading} />
    <Box display="flex" flexDirection="column" gap={0.5} overflow="hidden" __minWidth={0}>
      <Text size={5} fontWeight="bold">
        <FormattedMessage
          defaultMessage="Order line metadata"
          id="QSTD5z"
          description="dialog title for order line metadata"
        />
      </Text>
      {loading ? (
        <Skeleton width={52} height={5} />
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
