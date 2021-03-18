import { ExpansionPanel, makeStyles } from "@material-ui/core";
import { Channel } from "@saleor/channels/types/Channel";
import Label from "@saleor/orders/components/OrderHistory/Label";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import ControlledCheckbox from "../ControlledCheckbox";

const useStyles = makeStyles(
  theme => ({
    optionWrapper: {
      padding: theme.spacing(2, 3)
    },
    notFound: {
      paddingBottom: theme.spacing(2)
    }
  }),
  { name: "ChannelsList" }
);

const useExpanderStyles = makeStyles(
  () => ({
    // empty expanded needed for mui to use root styles
    expanded: {},
    root: {
      boxShadow: "none",

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "ChannelsListExpander" }
);

const messages = defineMessages({
  notFoundTitle: {
    defaultMessage: "No Channels Found",
    description: "no channels found title"
  }
});

interface ChannelsListProps {
  channels: Channel[];
  isChannelSelected: (id: string) => boolean;
}

const ChannelsList: React.FC<ChannelsListProps> = ({
  channels,
  isChannelSelected
}) => {
  const expanderClasses = useExpanderStyles();
  const classes = useStyles({});
  const intl = useIntl();

  if (!channels.length) {
    return (
      <div className={classes.notFound}>
        {intl.formatMessage(messages.notFoundTitle)}
      </div>
    );
  }

  return (
    <>
      {channels.map(({ channel: { name, id } }) => (
        <ExpansionPanel classes={expanderClasses}>
          <div className={classes.optionWrapper}>
            <ControlledCheckbox
              checked={isChannelSelected(id)}
              name={name}
              label={<Label text={"lol"} />}
              onChange={() => onChannelSelectChange(option)}
            />
          </div>
          {/* <div
        key={option.id}
        className={classes.option}
        data-test-id="channel-row"
      >
        <ControlledCheckbox
          checked={isOptionSelected(option)}
          name={option.name}
          label={<Label text={"lol"} />}
          onChange={() => onOptionSelectChange(option)}
        />
        <Hr />
      </div> */}
        </ExpansionPanel>
      ))}
    </>
  );
};

export default ChannelsList;
