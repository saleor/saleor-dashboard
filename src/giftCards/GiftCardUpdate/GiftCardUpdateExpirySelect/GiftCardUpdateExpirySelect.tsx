import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import useGiftCardUpdateForm from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { giftCardExpirySelectMessages as messages } from "./messages";
import { useGiftCardExpirySelectStyles as useStyles } from "./styles";

const GiftCardUpdateExpirySelect: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});
  const {
    change,
    data: { expiryDate },
    formErrors,
  } = useGiftCardUpdateForm();
  const [cardExpiresSelected, setCardExpiresSelected] = useStateFromProps(!!expiryDate);

  useEffect(() => {
    if (!cardExpiresSelected) {
      change({
        target: {
          name: "expiryDate",
          value: null,
        },
      });
    }
  }, [cardExpiresSelected]);

  return (
    <>
      <Text>{intl.formatMessage(messages.expiryDateLabel)}</Text>
      <VerticalSpacer />
      <ControlledCheckbox
        data-test-id="gift-card-expire-section"
        name="cardExpires"
        label={intl.formatMessage(messages.expiryDateCheckboxLabel)}
        checked={cardExpiresSelected}
        onChange={event => setCardExpiresSelected(event.target.value)}
      />

      {cardExpiresSelected && (
        <TextField
          error={!!formErrors?.expiryDate}
          helperText={getGiftCardErrorMessage(formErrors?.expiryDate, intl)}
          onChange={change}
          name={"expiryDate"}
          fullWidth
          className={classes.dateField}
          label={intl.formatMessage(messages.expiryDateLabel)}
          value={expiryDate}
          InputLabelProps={{
            shrink: true,
          }}
          type="date"
        />
      )}
    </>
  );
};

export default GiftCardUpdateExpirySelect;
