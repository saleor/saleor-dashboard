import { ChannelFragment } from "@dashboard/graphql";
import { ChannelProps } from "@dashboard/types";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box, Select } from "@saleor/macaw-ui-next";
import React from "react";

export interface AppChannelSelectProps extends ChannelProps {
  channels: ChannelFragment[];
  onChannelSelect: (id: string) => void;
}

const AppChannelSelect: React.FC<AppChannelSelectProps> = ({
  channels,
  onChannelSelect,
  selectedChannelId,
}) => {
  return (
    <Box>
      <Select
        __width={130}
        data-test-id="app-channel-select"
        size="large"
        onChange={value => onChannelSelect(value)}
        value={selectedChannelId}
        options={mapNodeToChoice(channels)}
      />
    </Box>
  );
};

AppChannelSelect.displayName = "AppChannelSelect";
export default AppChannelSelect;
