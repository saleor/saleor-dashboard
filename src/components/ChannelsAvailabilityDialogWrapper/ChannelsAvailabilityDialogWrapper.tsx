import { TextField, Typography } from "@material-ui/core";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { useIntl } from "react-intl";
import { defineMessages, FormattedMessage } from "react-intl";

export const useStyles = makeStyles(
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
    notFound: {
      paddingBottom: theme.spacing(2)
    },
    scrollArea: {
      maxHeight: 400,
      overflowY: "scroll"
    },
    text: {
      marginBottom: 5
    }
  }),
  { name: "ChannelsAvailabilityContent" }
);

const messages = defineMessages({
  selectTitle: {
    defaultMessage:
      "Select channels you want for {contentType} to be available on",
    description: "select title"
  },
  selectAllChannelsLabel: {
    defaultMessage: "Select All Channels",
    description: "select all channels label"
  },
  channelsAlphabeticallyTitle: {
    defaultMessage: "Channels from A to Z",
    description: "channels alphabetically title"
  },
  notFoundTitle: {
    defaultMessage: "No Channels Found",
    description: "no channels found title"
  }
});

export interface ChannelsAvailabilityContentProps {
  contentType?: string;
  toggleAll?: () => void;
  children: React.ReactNode;
  toggleAllLabel?: React.ReactNode;
  query: string;
  onQueryChange: (query: string) => void;
  hasAnyChannelsToDisplay: boolean;
  hasAllSelected: boolean;
}

export const ChannelsAvailabilityContentWrapper: React.FC<ChannelsAvailabilityContentProps> = ({
  contentType = "",
  toggleAll,
  toggleAllLabel,
  children,
  hasAnyChannelsToDisplay,
  query,
  onQueryChange,
  hasAllSelected
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const searchText = intl.formatMessage({
    defaultMessage: "Search through channels"
  });

  return (
    <div className={classes.content}>
      {!!contentType && (
        <Typography className={classes.text} variant="caption">
          <FormattedMessage {...messages.selectTitle} />
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
              checked={hasAllSelected}
              name="allChannels"
              label={
                toggleAllLabel || (
                  <Label
                    text={intl.formatMessage(messages.selectAllChannelsLabel)}
                  />
                )
              }
              onChange={toggleAll}
            />
            <Hr />
          </>
        )}
        <Typography className={classes.contentTitle}>
          <FormattedMessage {...messages.channelsAlphabeticallyTitle} />
        </Typography>
        <div
          className={classes.scrollArea}
          data-test-id="manage-products-channels-availiability-list"
        >
          {hasAnyChannelsToDisplay ? (
            children
          ) : (
            <div className={classes.notFound}>
              <FormattedMessage {...messages.notFoundTitle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelsAvailabilityContentWrapper;
