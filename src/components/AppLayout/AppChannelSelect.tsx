import { Select } from "@dashboard/components/Select";
import { ChannelFragment } from "@dashboard/graphql";
import { ChannelProps } from "@dashboard/types";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export interface AppChannelSelectProps extends ChannelProps {
  channels: ChannelFragment[];
  onChannelSelect: (id: string) => void;
}

const AppChannelSelect = ({
  channels,
  onChannelSelect,
  selectedChannelId,
}: AppChannelSelectProps) => {
  return (
    <Box>
      <Select
        __width={130}
        data-test-id="app-channel-select"
        size="large"
        onChange={({ target }) => onChannelSelect(target.value)}
        value={selectedChannelId}
        options={mapNodeToChoice(channels)}
      />
    </Box>
  );
};

AppChannelSelect.displayName = "AppChannelSelect";
export default AppChannelSelect;
