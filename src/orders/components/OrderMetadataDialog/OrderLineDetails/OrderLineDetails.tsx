import { OrderLineMetadataDetailsFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { OrderLineSubheaderData } from "./OrderLineSubheaderData";
import { VariantThumbnail } from "./VariantThumbnail";

export const OrderLineDetails = ({
  loading,
  data,
}: {
  loading: boolean;
  data: OrderLineMetadataDetailsFragment;
}) => {
  return (
    <Box display="flex" gap={5} alignItems="center" paddingX={6} width="100%">
      <VariantThumbnail src={data?.thumbnail?.url} loading={loading} />
      <Box display="flex" flexDirection="column" flexGrow="1" gap={2}>
        <Text size={7} flexGrow="1" fontWeight="bold">
          {loading ? (
            <Skeleton height={7} />
          ) : (
            <>
              <FormattedMessage {...commonMessages.orderLine} />: {data?.productName ?? ""}
            </>
          )}
        </Text>
        <OrderLineSubheaderData
          productSku={data?.productSku}
          quantity={data?.quantity}
          variantName={data?.variant?.name}
          loading={loading}
        />
      </Box>
    </Box>
  );
};
