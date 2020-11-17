import Typography from "@material-ui/core/Typography";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import {
  Choices,
  SingleSelectField
} from "@saleor/components/SingleSelectField";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";

export interface ChannelDeleteDialogProps {
  channelsChoices: Choices;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (targetChannelId: string) => void;
}

const ChannelDeleteDialog: React.FC<ChannelDeleteDialogProps> = ({
  channelsChoices = [],
  confirmButtonState,
  open,
  onBack,
  onClose,
  onConfirm
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const [choice, setChoice] = useStateFromProps(
    !!channelsChoices.length ? channelsChoices[0].value : ""
  );
  const hasChannels = !!channelsChoices?.length;

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => (hasChannels ? onConfirm(choice) : onBack())}
      title={intl.formatMessage({
        defaultMessage: "Delete Channel",
        description: "dialog header"
      })}
      confirmButtonLabel={intl.formatMessage(
        hasChannels ? buttonMessages.delete : buttonMessages.ok
      )}
      variant={hasChannels ? "delete" : "default"}
    >
      <div>
        {hasChannels ? (
          <>
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
                value={choice}
                onChange={e => setChoice(e.target.value)}
              />
            </div>
            <Typography>
              <FormattedMessage
                defaultMessage="Deleting channel will delete all product data regarding this channel. Are you sure you want to delete this channel?"
                description="delete channel"
              />
            </Typography>
          </>
        ) : (
          <Typography>
            <FormattedMessage
              defaultMessage="There is no available channel to move order information to. Please create a channel with same currency so that information can be moved to it."
              description="currency channel"
            />
          </Typography>
        )}
      </div>
    </ActionDialog>
  );
};
ChannelDeleteDialog.displayName = "ChannelDeleteDialog";
export default ChannelDeleteDialog;
