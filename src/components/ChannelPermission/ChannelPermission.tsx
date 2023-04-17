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
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "../CardTitle/CardTitle";

interface ChannelPermissionProps {
  channels: ChannelFragment[];
  description: string;
  fullAccessLabel: string;
}

export const ChannelPermission = ({
  channels,
  description,
  fullAccessLabel,
}: ChannelPermissionProps) => {
  const intl = useIntl();

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
        <ListItem role={undefined} dense button>
          <ListItemIcon>
            <Checkbox
              data-test-id="full-access"
              color="secondary"
              edge="start"
              checked={false}
              disabled={false}
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
          >
            <ListItemIcon>
              <Checkbox
                color="secondary"
                edge="start"
                checked={false}
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
