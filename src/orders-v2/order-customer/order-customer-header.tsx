import { customerUrl } from "@dashboard/customers/urls";
import { orderListUrl } from "@dashboard/orders/urls";
import { Box, BoxProps, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { UnderlineLink } from "../underline-link";

interface Props extends BoxProps {
  userId: string;
}

export const OrderCustomerHeader = ({ userId, ...props }: Props) => {
  const intl = useIntl();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      {...props}
    >
      <Text size={5} fontWeight="medium">
        {intl.formatMessage({ id: "zgrORK", defaultMessage: "Customer details" })}
      </Text>
      <Box display="flex" gap={4}>
        {/* TODO: add link to order list with filter by customer id */}
        <UnderlineLink to={orderListUrl()}>
          {intl.formatMessage({ id: "4ABral", defaultMessage: "View orders" })}
        </UnderlineLink>
        <UnderlineLink to={customerUrl(userId)}>
          {intl.formatMessage({ id: "yGGPTl", defaultMessage: "View profile" })}
        </UnderlineLink>
      </Box>
    </Box>
  );
};
