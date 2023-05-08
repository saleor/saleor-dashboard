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
  isAlignToRight?: boolean;
}

export const Root: React.FC<PropsWithChildren<TopNavProps>> = ({
  title,
  href,
  withoutBorder = false,
  isAlignToRight = true,
  children,
}) => {
  const { availableChannels, channel, isPickerActive, setChannel } =
    useAppChannel(false);

  return (
    <TopNavWrapper withoutBorder={withoutBorder}>
      {href && <TopNavLink to={href} />}
      <Box __flex={isAlignToRight ? 1 : 0}>
        <Text variant="title" size="small">
          {title}
        </Text>
      </Box>
      <Box
        display="flex"
        flexWrap="nowrap"
        __flex={isAlignToRight ? "initial" : 1}
      >
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
