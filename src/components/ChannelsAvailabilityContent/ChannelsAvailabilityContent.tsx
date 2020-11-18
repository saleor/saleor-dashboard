import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Channel } from "@saleor/channels/utils";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface ChannelsAvailabilityContentProps {
  isSelected: (option: Channel) => boolean;
  channels: Channel[];
  contentType?: string;
  disabled: boolean;
  onChange: (option: Channel) => void;
  selected?: number;
  toggleAllText?: string;
  toggleAll?: (items: Channel[], selected: number) => void;
}

export const ChannelsAvailabilityContent: React.FC<ChannelsAvailabilityContentProps> = ({
  isSelected,
  channels,
  contentType = "",
  onChange,
  selected = 0,
  toggleAll,
  toggleAllText
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const searchText = intl.formatMessage({
    defaultMessage: "Search through channels"
  });
  const [query, onQueryChange] = React.useState("");
  const filteredChannels = filter(channels, query, { key: "name" });

  return (
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
        label={searchText}
        placeholder={searchText}
        fullWidth
      />
      <div className={classes.dialog}>
        {!!toggleAll && (
          <>
            <ControlledCheckbox
              checked={selected === channels?.length}
              name="allChannels"
              label={
                toggleAllText || (
                  <Typography className={classes.label}>
                    <FormattedMessage defaultMessage="Select all channels" />
                  </Typography>
                )
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
          {filteredChannels?.length ? (
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
  );
};
ChannelsAvailabilityContent.displayName = "ChannelsAvailabilityContent";
export default ChannelsAvailabilityContent;
