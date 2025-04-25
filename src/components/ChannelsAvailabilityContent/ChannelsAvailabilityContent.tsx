import { Channel } from "@dashboard/channels/utils";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import Hr from "@dashboard/components/Hr";
import { fuzzySearch } from "@dashboard/misc";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
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
  toggleAllText,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const searchText = intl.formatMessage({
    id: "ybaLoZ",
    defaultMessage: "Search through channels",
  });
  const [query, onQueryChange] = React.useState("");
  const searchResults = fuzzySearch(channels, query, ["name"]);

  return (
    <div className={classes.content}>
      {!!contentType && (
        <Text className={classes.text} size={2} fontWeight="light">
          <FormattedMessage
            id="tQuE1q"
            defaultMessage="Select channels you want for {contentType} to be available on"
            values={{ contentType }}
          />
        </Text>
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
                  <Text className={classes.label}>
                    <FormattedMessage id="2/L4zZ" defaultMessage="Select all channels" />
                  </Text>
                )
              }
              onChange={() => toggleAll(channels, selected)}
            />
            <Hr />
          </>
        )}
        <Text className={classes.contentTitle}>
          <FormattedMessage id="EWCUdP" defaultMessage="Channels A to Z" />
        </Text>
        <div
          className={classes.scrollArea}
          data-test-id="manage-products-channels-availiability-list"
        >
          {searchResults.length ? (
            searchResults.map(option => (
              <div key={option.id} className={classes.option} data-test-id="channel-row">
                <ControlledCheckbox
                  checked={isSelected(option)}
                  name={option.name}
                  label={<Text className={classes.label}>{option.name}</Text>}
                  onChange={() => onChange(option)}
                />
                <Hr />
              </div>
            ))
          ) : (
            <div className={classes.notFound}>
              <FormattedMessage id="B9yrkK" defaultMessage="No Channels found" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
ChannelsAvailabilityContent.displayName = "ChannelsAvailabilityContent";
export default ChannelsAvailabilityContent;
