import { ChannelFragment } from "@dashboard/graphql";
import { ChannelProps } from "@dashboard/types";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import React from "react";

import SingleSelectField from "../SingleSelectField";

const useStyles = makeStyles(
  {
    input: {
      height: 40,
    },
    root: {
      "&& fieldset": {
        borderColor: vars.colors.border.default1,
      },
      width: 192,
      padding: 10,
    },
  },
  {
    name: "AppChannelSelect",
  },
);

export interface AppChannelSelectProps extends ChannelProps {
  channels: ChannelFragment[];
  onChannelSelect: (id: string) => void;
}

const AppChannelSelect: React.FC<AppChannelSelectProps> = ({
  channels,
  onChannelSelect,
  selectedChannelId,
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <SingleSelectField
        InputProps={{
          className: classes.input,
        }}
        testId="app-channel-select"
        choices={mapNodeToChoice(channels)}
        value={selectedChannelId}
        onChange={event => onChannelSelect(event.target.value)}
      />
    </div>
  );
};

AppChannelSelect.displayName = "AppChannelSelect";
export default AppChannelSelect;
