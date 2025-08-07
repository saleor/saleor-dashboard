import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Select } from "@dashboard/components/Select";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { Option, Text } from "@saleor/macaw-ui-next";
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

const ChannelDeleteDialog = ({
  channelsChoices = [],
  channelSlug,
  hasOrders,
  confirmButtonState,
  open,
  onBack,
  currency,
  onClose,
  onConfirm,
}: ChannelDeleteDialogProps) => {
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
              <Text>{intl.formatMessage(messages.deletingAllProductData)}</Text>
              <br />
              <Text>
                {intl.formatMessage(messages.needToBeMoved)}
                <br />
                {intl.formatMessage(messages.note)}
              </Text>
              <div className={classes.select}>
                <Select
                  label={intl.formatMessage(messages.selectChannel)}
                  name="channels"
                  onChange={({ target }) => setChoice(target.value)}
                  value={choice}
                  options={channelsChoices}
                />
              </div>
            </>
          ) : (
            <Text>
              {intl.formatMessage(messages.noAvailableChannel, {
                channelSlug: <strong>{channelSlug}</strong>,
                currency: <strong>{currency}</strong>,
              })}
            </Text>
          )
        ) : (
          <Text>{intl.formatMessage(messages.deletingAllProductData)}</Text>
        )}
      </div>
    </ActionDialog>
  );
};

ChannelDeleteDialog.displayName = "ChannelDeleteDialog";
export default ChannelDeleteDialog;
