import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { SingleSelectField } from "@saleor/components/SingleSelectField";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Channels_channels } from "../../types/Channels";
import { useStyles } from "../styles";

export interface ChannelDeleteDialogProps {
  channelsList: Channels_channels[];
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChannelDeleteDialog: React.FC<ChannelDeleteDialogProps> = ({
  channelsList,
  confirmButtonState,
  open,
  onClose,
  onConfirm
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const channelsChoices = channelsList.map(channel => ({
    label: channel.name,
    value: channel.id
  }));
  const [choice, setValue] = useState(channelsChoices[0]);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage({
        defaultMessage: "Delete Channel",
        description: "dialog header"
      })}
      variant="delete"
    >
      <DialogContentText>
        <FormattedMessage
          defaultMessage="All order information from this channel need to be moved to a different channel. Please select channel orders need to be moved to:."
          description="delete channel"
        />
        <div className={classes.select}>
          <SingleSelectField
            choices={channelsChoices}
            label={intl.formatMessage({
              defaultMessage: "Select Channel",
              description: "dialog header"
            })}
            value={choice.value}
            onChange={setValue}
          />
        </div>
        <FormattedMessage
          defaultMessage="Deleting channel will delete all product data regarding this channel. Are you sure you want to delete this channel?"
          description="delete channel"
        />
      </DialogContentText>
    </ActionDialog>
  );
};
ChannelDeleteDialog.displayName = "ChannelDeleteDialog";
export default ChannelDeleteDialog;
