import { useUser } from "@dashboard/auth";
import { Box, Text } from "@saleor/macaw-ui-next";
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
  const { channel, isPickerActive, setChannel } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];

  return (
    <TopNavWrapper withoutBorder={withoutBorder}>
      {href && <TopNavLink to={href} />}
      <Box __flex={isAlignToRight ? 1 : 0} __minWidth="max-content">
        <Text size={6}>{title}</Text>
      </Box>
      <Box
        display="flex"
        flexWrap="nowrap"
        height="100%"
        __flex={isAlignToRight ? "initial" : 1}
      >
        {isPickerActive && channels.length > 0 && (
          <AppChannelSelect
            channels={channels}
            selectedChannelId={channel?.id}
            onChannelSelect={setChannel}
          />
        )}
        {children}
      </Box>
    </TopNavWrapper>
  );
};
