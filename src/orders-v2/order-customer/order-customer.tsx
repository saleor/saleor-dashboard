import { AddressFragment } from "@dashboard/graphql";
import { Box, BoxProps } from "@saleor/macaw-ui-next";

import { OrderAddress } from "./order-address";
import { OrderCustomerEmail } from "./order-customer-email";
import { OrderCustomerHeader } from "./order-customer-header";

interface Props extends BoxProps {
  userEmail: string | null;
  userId: string | undefined;
  shippingAddress: AddressFragment | null;
  billingAddress: AddressFragment | null;
}

export const OrderCustomer = ({
  userEmail,
  userId,
  shippingAddress,
  billingAddress,
  ...props
}: Props) => {
  return (
    <Box padding={6} gap={4} display="grid" {...props}>
      <Box gap={1} display="grid">
        {userId && <OrderCustomerHeader userId={userId} />}
        {userEmail && <OrderCustomerEmail userEmail={userEmail} />}
      </Box>
      {shippingAddress && <OrderAddress type="shipping" address={shippingAddress} />}
      {billingAddress && <OrderAddress type="billing" address={billingAddress} />}
    </Box>
  );
};
