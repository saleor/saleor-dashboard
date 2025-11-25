import { OrderDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderPaymentStatusPill } from "../OrderPaymentSummaryCard/components/OrderPaymentStatusPill";

type Props = {
  order: OrderDetailsFragment;
  description: string;
};

export const PaymentsSummaryHeader = ({ order, description }: Props) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start">
      <Box display="flex" flexDirection="column">
        <Text fontWeight="medium" fontSize={6}>
          {intl.formatMessage({
            defaultMessage: "Payments summary",
            id: "q7bXR4",
          })}
        </Text>
        <Text color="default2" size={2}>
          {description}
        </Text>
      </Box>
      <OrderPaymentStatusPill order={order} />
    </Box>
  );
};
