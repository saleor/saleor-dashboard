import { useUser } from "@dashboard/auth";
import { Box, Text } from "@saleor/macaw-ui-next";
import { PropsWithChildren } from "react";
import * as React from "react";

import useAppChannel from "../AppChannelContext";
import AppChannelSelect from "../AppChannelSelect";
import { ContextualLine } from "../ContextualLinks/ContextualLine";
import { TopNavLink } from "./TopNavLink";
import { TopNavWrapper } from "./TopNavWrapper";

interface TopNavProps {
  title: string | React.ReactNode;
  subtitle?: React.ReactNode;
  href?: string;
  withoutBorder?: boolean;
  isAlignToRight?: boolean;
}

export const Root = ({
  title,
  subtitle,
  href,
  withoutBorder = false,
  isAlignToRight = true,
  children,
}: PropsWithChildren<TopNavProps>) => {
  const { channel, isPickerActive, setChannel } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];

  return (
    <TopNavWrapper withoutBorder={withoutBorder} hasSubtitle={!!subtitle}>
      <Box display="flex" alignItems="center" width="100%">
        {href && <TopNavLink to={href} />}
        <Box __flex={isAlignToRight ? 1 : 0} __minWidth="max-content">
          <Text size={6}>{title}</Text>
        </Box>
        <Box display="flex" flexWrap="nowrap" height="100%" __flex={isAlignToRight ? "initial" : 1}>
          {isPickerActive && channels.length > 0 && (
            <AppChannelSelect
              channels={channels}
              selectedChannelId={channel?.id}
              onChannelSelect={setChannel}
            />
          )}
          {children}
        </Box>
      </Box>
      {subtitle ? (
        <ContextualLine
          gridColumn="8"
          // The subtitle should be aligned with the title, not back button
          marginLeft={href ? 12 : 0}
          __marginTop={href ? "-0.6rem" : 0}
        >
          {subtitle}
        </ContextualLine>
      ) : null}
    </TopNavWrapper>
  );
};
