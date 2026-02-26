import { useUser } from "@dashboard/auth/useUser";
import { Box, type BoxProps, Text } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

import useAppChannel from "../AppChannelContext";
import AppChannelSelect from "../AppChannelSelect";
import { ContextualLine } from "../ContextualLinks/ContextualLine";
import { TopNavLink } from "./TopNavLink";
import { TopNavWrapper } from "./TopNavWrapper";

interface TopNavProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  subtitleTop?: React.ReactNode;
  href?: string;
  withoutBorder?: boolean;
  isAlignToRight?: boolean;
}

export const Root = ({
  title,
  subtitle,
  subtitleTop,
  href,
  withoutBorder = false,
  isAlignToRight = true,
  children,
  ...wrapperProps
}: PropsWithChildren<TopNavProps> & Omit<BoxProps, keyof TopNavProps>) => {
  const { channel, isPickerActive, setChannel } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];

  if (subtitleTop && subtitle)
    throw new Error(
      "TopNav is not ready to support both subtitle and subtitleTop. Extend the component or use one of them",
    );

  return (
    <TopNavWrapper
      withoutBorder={withoutBorder}
      hasSubtitleTop={!!subtitleTop}
      hasSubtitle={!!subtitle}
      {...wrapperProps}
    >
      {subtitleTop ? (
        <ContextualLine
          gridColumn="8"
          // The subtitle should be aligned with the title, not back button
          marginLeft={href ? 12 : 0}
          paddingBottom={0}
          __marginBottom="-10px"
        >
          {subtitleTop}
        </ContextualLine>
      ) : null}
      <Box display="flex" alignItems="center" width="100%">
        {href && <TopNavLink to={href} />}
        <Box
          __flex={isAlignToRight ? "1 1 auto" : 0}
          overflow="hidden"
          title={typeof title === "string" ? title : undefined}
        >
          <Text size={6} ellipsis display="block">
            {title}
          </Text>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          height="100%"
          gap={2}
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
