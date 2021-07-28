import { Divider, TextField } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import ActionDialog from "@saleor/components/ActionDialog";
import CardSpacer from "@saleor/components/CardSpacer";
import GiftCardExpirySelect from "@saleor/giftCards/components/GiftCardExpirySelect";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardCreateFormContext } from "../GiftCardsList/GiftCardCreateFormProvider";
import GiftCardBalanceTextWithSelectField from "./GiftCardBalanceTextWithSelectField";
import CustomerSelectField from "./GiftCardCustomerSelectField";
import { giftCardCreateDialogMessages as messages } from "./messages";

interface GiftCardCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles(
  () => ({
    noteField: {
      width: "100%"
    }
  }),
  { name: "GiftCardCreateDialog" }
);

const GiftCardCreateDialog: React.FC<GiftCardCreateDialogProps> = ({
  open,
  onClose
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    submit,
    change,
    setSelectedTag,
    selectedTag,
    data: { expiryPeriodAmount, expiryPeriodType, expiryType }
  } = useContext(GiftCardCreateFormContext);

  return (
    <ActionDialog
      maxWidth="sm"
      open={open}
      onConfirm={submit}
      confirmButtonLabel={intl.formatMessage(messages.issueButtonLabel)}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
    >
      <GiftCardBalanceTextWithSelectField />
      <CardSpacer />
      <GiftCardTagInput
        name="tag"
        value={selectedTag}
        setSelected={setSelectedTag}
        change={change}
      />
      <CardSpacer />
      <Divider />
      <CardSpacer />
      <CustomerSelectField />
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
      <TextField
        multiline
        className={classes.noteField}
        label={`${intl.formatMessage(messages.noteLabel)} *${intl.formatMessage(
          commonMessages.optionalField
        )}`}
      />
      <VerticalSpacer />
      <Label text={intl.formatMessage(messages.noteSubtitle)} />
    </ActionDialog>
  );
};

export default GiftCardCreateDialog;
