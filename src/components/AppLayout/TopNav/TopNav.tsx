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
  isLineToRight?: boolean;
}

export const TopNav: React.FC<PropsWithChildren<TopNavProps>> = ({
  title,
  href,
  withoutBorder = false,
  isLineToRight = true,
  children,
}) => {
  const { availableChannels, channel, isPickerActive, setChannel } =
    useAppChannel(false);

  return (
    <TopNavWrapper withoutBorder={withoutBorder}>
      {href && <TopNavLink to={href} />}
      <Box __flex={isLineToRight ? 1 : 0}>
        <Text variant="title">{title}</Text>
      </Box>
      <Box display="flex" flexWrap="nowrap" __flex={isLineToRight ? 0 : 1}>
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
