import { ChannelFragment } from "@dashboard/graphql";
import {
  Card,
  CardContent,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { useIntl } from "react-intl";

import CardTitle from "../CardTitle/CardTitle";

interface ChannelPermissionProps {
  channels: ChannelFragment[];
  description: string;
  fullAccessLabel: string;
  disabled: boolean;
  data: {
    hasAllChannels: boolean;
    channels: ChannelFragment[];
  };
  onChange: (event: ChangeEvent<any>, cb?: () => void) => void;
}

export const ChannelPermission = ({
  channels,
  description,
  fullAccessLabel,
  disabled,
  onChange,
  data,
}: ChannelPermissionProps) => {
  const intl = useIntl();

  const handleAllChannelsChange = () => {
    onChange({
      target: {
        name: "hasAllChannels",
        value: !data.hasAllChannels,
      },
    } as any);

    onChange({
      target: {
        name: "channels",
        value: !data.hasAllChannels ? channels : [],
      },
    } as any);
  };

  const handleChannelChange = (channel: ChannelFragment) => () => {
    const hasChannelChecked = data.channels.find(
      chan => chan.id === channel.id,
    );

    if (hasChannelChecked) {
      onChange({
        target: {
          name: "channels",
          value: data.channels.filter(chan => chan.id !== channel.id),
        },
      } as any);
    } else {
      onChange({
        target: {
          name: "channels",
          value: [...data.channels, channel],
        },
      } as any);
    }
  };

  const isChannelChecked = (channel: ChannelFragment) =>
    !!data.channels.find(chan => chan.id === channel.id);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Channels permissions",
          id: "vz3yxp",
        })}
      ></CardTitle>
      <CardContent>
        <Typography variant="body2">{description}</Typography>
        <ListItem
          role={undefined}
          onClick={handleAllChannelsChange}
          dense
          button
        >
          <ListItemIcon>
            <Checkbox
              data-test-id="full-access"
              color="secondary"
              edge="start"
              checked={data.hasAllChannels}
              disabled={disabled}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "fullAccess" }}
            />
          </ListItemIcon>
          <ListItemText primary={fullAccessLabel} />
        </ListItem>
      </CardContent>
      <hr />
      <CardContent>
        {channels.map(channel => (
          <ListItem
            key={channel.id}
            disabled={!channel.isActive}
            role={undefined}
            dense
            button
            onClick={handleChannelChange(channel)}
          >
            <ListItemIcon>
              <Checkbox
                color="secondary"
                edge="start"
                checked={isChannelChecked(channel)}
                tabIndex={-1}
                disableRipple
                name={channel.name}
                inputProps={{ "aria-labelledby": channel.id }}
              />
            </ListItemIcon>
            <ListItemText
              id={channel.id}
              primary={channel.name.replace(/\./, "")}
            />
          </ListItem>
        ))}
      </CardContent>
    </Card>
  );
};
