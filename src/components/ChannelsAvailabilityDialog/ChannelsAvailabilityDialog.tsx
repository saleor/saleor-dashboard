import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { ChannelData, ChannelShippingData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    content: {
      "& hr": {
        left: -24,
        position: "relative",
        width: "calc(100% + 48px)"
      }
    },
    contentTitle: {
      margin: theme.spacing(1, 0)
    },
    dialog: {
      marginBottom: -30,
      marginTop: theme.spacing(2)
    },
    input: {
      "& label": {
        overflowX: "inherit"
      }
    },
    label: {
      fontSize: 14
    },
    notFound: {
      paddingBottom: theme.spacing(2)
    },
    option: {
      "&:last-child": {
        "& hr": {
          display: "none"
        }
      },
      margin: theme.spacing(1, 0)
    },
    scrollArea: {
      maxHeight: 400,
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
  const filteredChannels = channels.filter(option =>
    option.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      disabled={disabled}
    >
      <div className={classes.content}>
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
          className={classes.input}
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
            <>
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
              <Hr />
            </>
          )}
          <Typography className={classes.contentTitle}>
            <FormattedMessage defaultMessage="Channels A to Z" />
          </Typography>
          <div className={classes.scrollArea}>
            {filteredChannels.length ? (
              filteredChannels.map(option => (
                <div key={option.id} className={classes.option}>
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
                  <Hr />
                </div>
              ))
            ) : (
              <div className={classes.notFound}>
                <FormattedMessage defaultMessage="No Channels found" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ActionDialog>
  );
};
ChannelsAvailabilityDialog.displayName = "ChannelsAvailabilityDialog";
export default ChannelsAvailabilityDialog;
