import Typography from "@material-ui/core/Typography";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { SingleSelectField } from "@saleor/components/SingleSelectField";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";

export interface ChannelDeleteDialogProps {
  channelsChoices: Array<{
    value: string;
    label: string | React.ReactNode;
  }>;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChannelDeleteDialog: React.FC<ChannelDeleteDialogProps> = ({
  channelsChoices = [],
  confirmButtonState,
  open,
  onClose,
  onConfirm
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [choice, setValue] = useState({
    value: channelsChoices[0].value,
    name: "channels"
  });

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
      <div>
        <Typography>
          <FormattedMessage
            defaultMessage="All order information from this channel need to be moved to a different channel. Please select channel orders need to be moved to:."
            description="delete channel"
          />
        </Typography>
        <div className={classes.select}>
          <SingleSelectField
            choices={channelsChoices}
            name="channels"
            label={intl.formatMessage({
              defaultMessage: "Select Channel",
              description: "dialog header"
            })}
            value={choice.value}
            onChange={e => setValue(e.target)}
          />
        </div>
        <Typography>
          <FormattedMessage
            defaultMessage="Deleting channel will delete all product data regarding this channel. Are you sure you want to delete this channel?"
            description="delete channel"
          />
        </Typography>
      </div>
    </ActionDialog>
  );
};
ChannelDeleteDialog.displayName = "ChannelDeleteDialog";
export default ChannelDeleteDialog;
