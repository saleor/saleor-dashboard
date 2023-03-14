import { Box, Text } from "@saleor/macaw-ui/next";
import React, { PropsWithChildren } from "react";

import useAppChannel from "../AppChannelContext";
import AppChannelSelect from "../AppChannelSelect";
import { TopNavLink } from "./TopNavLink";
import { TopNavWrapper } from "./TopNavWrapper";

interface TopNavProps {
  title: string | React.ReactNode;
  href?: string;
  withoutBorder?: boolean;
}

export const TopNav: React.FC<PropsWithChildren<TopNavProps>> = ({
  title,
  href,
  withoutBorder = false,
  children,
}) => {
  const { availableChannels, channel, isPickerActive, setChannel } =
    useAppChannel(false);

  return (
    <TopNavWrapper withoutBorder={withoutBorder}>
      {href && <TopNavLink to={href} />}
      <Box __flex={1}>
        <Text variant="title">{title}</Text>
      </Box>
      <Box display="flex" flexWrap="nowrap">
        {isPickerActive && (
          <AppChannelSelect
            channels={availableChannels}
            selectedChannelId={channel?.id}
            onChannelSelect={setChannel}
          />
        )}
        {children}
      </Box>
    </TopNavWrapper>
  );
};
