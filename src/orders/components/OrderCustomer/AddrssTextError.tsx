import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { useAddressTextErrorStyles } from "./styles";

interface AddressTextErrorProps {
  orderError: OrderErrorFragment;
}

export const AddressTextError = ({ orderError }: AddressTextErrorProps) => {
  const intl = useIntl();
  const classes = useAddressTextErrorStyles();

  return (
    <>
      <Text size={3} fontWeight="regular" className={classes.textError}>
        {getOrderErrorMessage(orderError, intl)}
      </Text>
      <FormSpacer />
    </>
  );
};
