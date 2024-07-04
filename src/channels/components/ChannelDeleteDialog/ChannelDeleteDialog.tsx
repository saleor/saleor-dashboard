import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { Typography } from "@material-ui/core";
import { Option, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { useStyles } from "../styles";

const messages = defineMessages({
  deleteChannel: {
    id: "LATHyi",
    defaultMessage: "Delete Channel: {channelSlug} ",
    description: "dialog header",
  },
  deletingAllProductData: {
    id: "GCho9N",
    defaultMessage:
      "All channel settings information such as shipping, product listings, warehouse assignments, etc, will be lost.",
    description: "delete channel",
  },
  needToBeMoved: {
    id: "BR8au7",
    defaultMessage: "Select channel that you wish to move existing orders to.",
    description: "delete channel",
  },
  note: {
    id: "wXFttp",
    defaultMessage: "Note: Only channels with matching currency are available.",
    description: "note on currency",
  },
  noAvailableChannel: {
    id: "Ge+dUe",
    defaultMessage:
      "To delete {channelSlug} you have to create a chanel with currency: {currency} to be able to move all existing orders.",
    description: "currency channel",
  },
  selectChannel: {
    id: "GP0zGO",
    defaultMessage: "Select destination channel:",
    description: "dialog header",
  },
});

export interface ChannelDeleteDialogProps {
  channelsChoices: Option[];
  channelSlug: string;
  currency: string;
  hasOrders: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (targetChannelId: string) => void;
}

const ChannelDeleteDialog: React.FC<ChannelDeleteDialogProps> = ({
  channelsChoices = [],
  channelSlug,
  hasOrders,
  confirmButtonState,
  open,
  onBack,
  currency,
  onClose,
  onConfirm,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [choice, setChoice] = useStateFromProps(
    channelsChoices.length ? channelsChoices[0].value : "",
  );
  const hasChannels = !!channelsChoices?.length;
  const canBeDeleted = hasChannels || !hasOrders;

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      backButtonText={
        canBeDeleted ? buttonMessages.cancel.defaultMessage : buttonMessages.ok.defaultMessage
      }
      open={open}
      onClose={onClose}
      onConfirm={() => (canBeDeleted ? onConfirm(choice) : onBack())}
      title={intl.formatMessage(messages.deleteChannel, { channelSlug })}
      confirmButtonLabel={intl.formatMessage(
        canBeDeleted ? buttonMessages.delete : buttonMessages.cancel,
      )}
      variant={canBeDeleted ? "delete" : "info"}
    >
      <div>
        {hasOrders ? (
          hasChannels ? (
            <>
              <Typography>{intl.formatMessage(messages.deletingAllProductData)}</Typography>
              <br />
              <Typography>
                {intl.formatMessage(messages.needToBeMoved)}
                <br />
                {intl.formatMessage(messages.note)}
              </Typography>
              <div className={classes.select}>
                <Select
                  label={intl.formatMessage(messages.selectChannel)}
                  name="inputType"
                  onChange={value => setChoice(value)}
                  value={choice}
                  options={channelsChoices}
                />
              </div>
            </>
          ) : (
            <Typography>
              {intl.formatMessage(messages.noAvailableChannel, {
                channelSlug: <strong>{channelSlug}</strong>,
                currency: <strong>{currency}</strong>,
              })}
            </Typography>
          )
        ) : (
          <Typography>{intl.formatMessage(messages.deletingAllProductData)}</Typography>
        )}
      </div>
    </ActionDialog>
  );
};

ChannelDeleteDialog.displayName = "ChannelDeleteDialog";
export default ChannelDeleteDialog;
