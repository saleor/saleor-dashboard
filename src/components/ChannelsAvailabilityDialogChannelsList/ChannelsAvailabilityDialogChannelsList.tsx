import { Channel } from "@dashboard/channels/utils";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import Hr from "@dashboard/components/Hr";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export const useStyles = makeStyles(
  theme => ({
    label: {
      fontSize: 14,
    },
    option: {
      "&:last-child": {
        "& hr": {
          display: "none",
        },
      },
      margin: theme.spacing(1, 0),
    },
  }),
  { name: "ChannelsAvailabilityContent" },
);

export interface ChannelsAvailabilityContentProps {
  isChannelSelected: (channel: Channel) => boolean;
  channels: Channel[];
  onChange: (option: Channel) => void;
}

const ChannelsAvailabilityContent: React.FC<ChannelsAvailabilityContentProps> = ({
  isChannelSelected,
  channels,
  onChange,
}) => {
  const classes = useStyles({});

  return (
    <>
      {channels.map(option => (
        <div
          key={option.id}
          className={classes.option}
          data-test-id="channel-row"
        >
          <ControlledCheckbox
            checked={isChannelSelected(option)}
            name={option.name}
            label={
              <Typography className={classes.label}>{option.name}</Typography>
            }
            onChange={() => onChange(option)}
          />
          <Hr />
        </div>
      ))}
    </>
  );
};

export default ChannelsAvailabilityContent;
