import makeStyles from "@material-ui/core/styles/makeStyles";
import { ChannelDetailsFragment } from "@saleor/fragments/types/ChannelDetailsFragment";
import { ChannelProps } from "@saleor/types";
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

export interface AppChannelSelectProps extends ChannelProps {
  channels: ChannelDetailsFragment[];
  disabled: boolean;
  onChannelSelect: (id: string) => void;
}

const AppChannelSelect: React.FC<AppChannelSelectProps> = ({
  channels,
  disabled,
  onChannelSelect,
  selectedChannelId
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <SingleSelectField
        choices={mapNodeToChoice(channels)}
        disabled={disabled}
        value={selectedChannelId}
        onChange={event => onChannelSelect(event.target.value)}
      />
    </div>
  );
};

AppChannelSelect.displayName = "AppChannelSelect";
export default AppChannelSelect;
