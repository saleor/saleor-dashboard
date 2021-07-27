import { Divider, TextField } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import ActionDialog from "@saleor/components/ActionDialog";
import CardSpacer from "@saleor/components/CardSpacer";
import TextWithSelectField from "@saleor/components/TextWithSelectField";
import GiftCardExpirySelect from "@saleor/giftCards/components/GiftCardExpirySelect";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import { makeStyles } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardCreateFormContext } from "../GiftCardCreateFormProvider";
import CustomerSelectField from "./CustomerSelectField";
import { giftCardCreateDialogMessages as messages } from "./messages";

interface GiftCardCreateDialogProps {
  open: boolean;
}

const useStyles = makeStyles(
  () => ({
    container: {
      width: 650
    },
    currencySelectField: {
      width: 100
    },
    noteField: {
      width: "100%"
    }
  }),
  { name: "GiftCardCreateDialog" }
);

const GiftCardCreateDialog: React.FC<GiftCardCreateDialogProps> = ({
  open
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    submit,
    change,
    selectedCustomer,
    setSelectedTag,
    setSelectedCustomer,
    data: {
      balanceAmount,
      balanceCurrency,
      expiryPeriodAmount,
      expiryPeriodType,
      expiryType
    }
  } = useContext(GiftCardCreateFormContext);

  const currencies = ["USD", "GBP", "PLN"];

  return (
    <ActionDialog
      open={open}
      onConfirm={submit}
      confirmButtonLabel={intl.formatMessage(messages.issueButtonLabel)}
    >
      <TextWithSelectField
        textFieldLabel="Loool"
        change={change}
        choices={currencies.map(value => ({ value, label: value }))}
        textFieldName="balanceAmount"
        selectFieldName="balanceCurrency"
        textFieldValue={balanceAmount}
        selectFieldValue={balanceCurrency}
        selectFieldClassName={classes.currencySelectField}
      />
      <CardSpacer />
      <GiftCardTagInput
        name="tag"
        setSelected={setSelectedTag}
        change={change}
      />
      <CardSpacer />
      <Divider />
      <CardSpacer />
      <CustomerSelectField
        optional
        change={change}
        value={selectedCustomer}
        setSelected={setSelectedCustomer}
      />
      <VerticalSpacer />
      <Label text={intl.formatMessage(messages.customerSubtitle)} />
      <CardSpacer />
      <Divider />
      <CardSpacer />
      <GiftCardExpirySelect
        change={change}
        expiryType={expiryType}
        expiryPeriodAmount={expiryPeriodAmount}
        expiryPeriodType={expiryPeriodType}
      />
      <CardSpacer />
      <TextField multiline className={classes.noteField} />
      <VerticalSpacer />
      <Label text={intl.formatMessage(messages.noteSubtitle)} />
    </ActionDialog>
  );
};

export default GiftCardCreateDialog;
