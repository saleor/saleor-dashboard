import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  ChannelCollectionData,
  ChannelData,
  ChannelSaleData,
  ChannelShippingData,
  ChannelVoucherData
} from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

type ChannelOption =
  | ChannelData
  | ChannelShippingData
  | ChannelVoucherData
  | ChannelSaleData
  | ChannelCollectionData;

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
  const filteredChannels = filter(channels, query, { key: "name" });
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
