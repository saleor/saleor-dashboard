import Typography from "@material-ui/core/Typography";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import {
  Choices,
  SingleSelectField
} from "@saleor/components/SingleSelectField";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";

export interface ChannelSettingsDialogProps {
  channelsChoices: Choices;
  confirmButtonState: ConfirmButtonTransitionState;
  defaultChoice: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

const ChannelSettingsDialog: React.FC<ChannelSettingsDialogProps> = ({
  channelsChoices = [],
  confirmButtonState,
  defaultChoice,
  open,
  onClose,
  onConfirm
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [choice, setChoice] = useState(
    defaultChoice || (!!channelsChoices.length ? channelsChoices[0].value : "")
  );

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(choice)}
      title={intl.formatMessage({
        defaultMessage: "Settings",
        description: "dialog header"
      })}
    >
      <div>
        <Typography>
          <FormattedMessage
            defaultMessage="Configure the way information are presented in catalog section of Dashboard."
            description="channel settings"
          />
        </Typography>
        <div className={classes.select}>
          <SingleSelectField
            choices={channelsChoices}
            name="channels"
            label={intl.formatMessage({
              defaultMessage: "Show prices for",
              description: "select label"
            })}
            value={choice}
            onChange={e => setChoice(e.target.value)}
          />
        </div>
      </div>
    </ActionDialog>
  );
};
ChannelSettingsDialog.displayName = "ChannelSettingsDialog";
export default ChannelSettingsDialog;
