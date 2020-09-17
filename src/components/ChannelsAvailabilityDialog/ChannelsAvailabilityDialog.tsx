import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { ChannelData, ChannelShippingData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    dialog: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    label: {
      fontSize: 14
    },
    scrollArea: {
      overflowY: "scroll"
    },
    text: {
      marginBottom: 5
    }
  }),
  { name: "ChannelsAvailabilityDialog" }
);

type ChannelOption = ChannelData | ChannelShippingData;

export interface ChannelsAvailabilityDialogProps {
  isSelected: (option: ChannelOption) => boolean;
  channels: ChannelOption[];
  confirmButtonState: ConfirmButtonTransitionState;
  contentType?: string;
  disabled: boolean;
  open: boolean;
  onClose: () => void;
  onChange: (option: ChannelOption) => void;
  onConfirm: () => void;
  selected?: number;
  title: string;
  toggleAll?: (items: ChannelOption[], selected: number) => void;
}

export const ChannelsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  isSelected,
  channels,
  confirmButtonState,
  contentType = "",
  disabled,
  open,
  onClose,
  onChange,
  onConfirm,
  selected = 0,
  title,
  toggleAll
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const [query, onQueryChange] = React.useState("");

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      disabled={disabled}
    >
      <div>
        {!!contentType && (
          <Typography className={classes.text} variant="caption">
            <FormattedMessage
              defaultMessage="Select channels you want for {contentType} to be available on"
              values={{ contentType }}
            />
          </Typography>
        )}
        <TextField
          name="query"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          label={intl.formatMessage({
            defaultMessage: "Search through channels"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Search through channels"
          })}
          fullWidth
        />
        <div className={classes.dialog}>
          {!!toggleAll && (
            <ControlledCheckbox
              checked={selected !== 0}
              name="allchannels"
              label={
                <Typography className={classes.label}>
                  <FormattedMessage defaultMessage="Available at all channels" />
                </Typography>
              }
              onChange={() => toggleAll(channels, selected)}
            />
          )}
          {channels.map(option =>
            option.name.toLowerCase().includes(query) ? (
              <div key={option.id}>
                <ControlledCheckbox
                  checked={isSelected(option)}
                  name={option.name}
                  label={
                    <Typography className={classes.label}>
                      {option.name}
                    </Typography>
                  }
                  onChange={() => onChange(option)}
                />
              </div>
            ) : null
          )}
        </div>
      </div>
    </ActionDialog>
  );
};
ChannelsAvailabilityDialog.displayName = "ChannelsAvailabilityDialog";
export default ChannelsAvailabilityDialog;
