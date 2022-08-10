import { Typography } from "@material-ui/core";
import FormSpacer from "@saleor/components/FormSpacer";
import { OrderErrorFragment } from "@saleor/graphql";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { useIntl } from "react-intl";

import { useAddressTextErrorStyles } from "./styles";

interface AddressTextErrorProps {
  orderError: OrderErrorFragment;
}

export const AddressTextError: React.FC<AddressTextErrorProps> = ({
  orderError,
}) => {
  const intl = useIntl();
  const classes = useAddressTextErrorStyles();

  return (
    <>
      <Typography variant="body2" className={classes.textError}>
        {getOrderErrorMessage(orderError, intl)}
      </Typography>
      <FormSpacer />
    </>
  );
};
