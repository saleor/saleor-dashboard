import Typography from "@material-ui/core/Typography";
import Hr from "@saleor/components/Hr";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import classNames from "classnames";
import React, { useState } from "react";

import { useStyles } from "./styles";
import { ChannelData, Message } from "./types";

export interface ChannelContentWrapperProps {
  data: ChannelData;
  children: React.ReactNode;
  messages: Message;
}

const ChannelContentWrapper: React.FC<ChannelContentWrapperProps> = ({
  data,
  messages,
  children
}) => {
  const { name } = data;
  const classes = useStyles({});
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className={classes.channelItem}>
        <div
          data-test="channel-availability-item"
          role="button"
          className={classes.channelBtn}
          onClick={() => setOpen(!isOpen)}
        >
          <div className={classes.channelName}>
            <Typography>{name}</Typography>
            <ArrowDropdown
              className={classNames(classes.arrow, {
                [classes.rotate]: isOpen
              })}
              color="primary"
            />
          </div>
          <Typography variant="caption">
            {messages.availableDateText}
          </Typography>
        </div>
        {React.Children.map(children, (channel: React.ReactElement<any>) =>
          React.cloneElement(channel, { ...channel.props, isOpen })
        )}
      </div>
      <Hr className={classes.hr} />
    </>
  );
};

export default ChannelContentWrapper;
