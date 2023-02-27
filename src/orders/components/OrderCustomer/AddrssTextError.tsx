import FormSpacer from "@dashboard/components/FormSpacer";
import { OrderErrorFragment } from "@dashboard/graphql";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { useAddressTextErrorStyles } from "./styles";

interface AddressTextErrorProps {
  orderError: OrderErrorFragment;
}

export const AddressTextError: React.FC<AddressTextErrorProps> = ({ orderError }) => {
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
