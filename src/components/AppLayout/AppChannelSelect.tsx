import makeStyles from "@material-ui/core/styles/makeStyles";
import { ChannelFragment } from "@saleor/fragments/types/ChannelFragment";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React from "react";

import SingleSelectField from "../SingleSelectField";

const useStyles = makeStyles(
  theme => ({
    root: {
      "&& fieldset": {
        borderColor: theme.palette.divider
      },
      marginRight: theme.spacing(2),
      width: 192
    }
  }),
  {
    name: "AppChannelSelect"
  }
);

export interface AppChannelSelectProps {
  channels: ChannelFragment[];
  selectedChannel: string;
  onChannelSelect: (id: string) => void;
}

const AppChannelSelect: React.FC<AppChannelSelectProps> = ({
  channels,
  onChannelSelect,
  selectedChannel
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <SingleSelectField
        choices={mapNodeToChoice(channels)}
        value={selectedChannel}
        onChange={event => onChannelSelect(event.target.value)}
      />
    </div>
  );
};

AppChannelSelect.displayName = "AppChannelSelect";
export default AppChannelSelect;
