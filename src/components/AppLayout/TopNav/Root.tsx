import { useUser } from "@dashboard/auth/useUser";
import { Box, type BoxProps, Text } from "@saleor/macaw-ui-next";
import { type PropsWithChildren, type ReactNode } from "react";

import useAppChannel from "../AppChannelContext";
import AppChannelSelect from "../AppChannelSelect";
import { ContextualLine } from "../ContextualLinks/ContextualLine";
import { TopNavLink } from "./TopNavLink";
import { TopNavWrapper } from "./TopNavWrapper";

type TopNavBaseProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Compact eyebrow above the title — stacked in the same bar height as the destination button. */
  subtitleTop?: React.ReactNode;
  withoutBorder?: boolean;
  isAlignToRight?: boolean;
  /** Gap between header action buttons. Detail pages use a slightly wider spacing. */
  actionsGap?: 2 | 3;
};

type TopNavProps = TopNavBaseProps &
  (
    | {
        /** Destination URL for the leading nav control. */
        href: string;
        /** Icon representing that destination (not a generic back arrow). */
        hrefIcon: ReactNode;
        /** Tooltip / aria-label for the destination (e.g. "All products"). */
        hrefTitle: string;
      }
    | {
        href?: undefined;
        hrefIcon?: undefined;
        hrefTitle?: undefined;
      }
  );

export const Root = ({
  title,
  subtitle,
  subtitleTop,
  href,
  hrefIcon,
  hrefTitle,
  withoutBorder = false,
  isAlignToRight = true,
  actionsGap = 2,
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
    <TopNavWrapper withoutBorder={withoutBorder} hasSubtitle={!!subtitle} {...wrapperProps}>
      <Box display="flex" alignItems="center" width="100%">
        {href && hrefIcon && hrefTitle ? (
          <TopNavLink to={href} icon={hrefIcon} title={hrefTitle} />
        ) : null}
        <Box
          __flex={isAlignToRight ? "1 1 auto" : 0}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={0.5}
          minWidth={0}
          title={typeof title === "string" ? title : undefined}
        >
          {subtitleTop ? (
            typeof subtitleTop === "string" ? (
              <Text size={2} color="default2" ellipsis display="block" __lineHeight={1.15}>
                {subtitleTop}
              </Text>
            ) : (
              <Box overflow="hidden" __lineHeight={1.15}>
                {subtitleTop}
              </Box>
            )
          ) : null}
          <Text size={6} ellipsis display="block" __lineHeight={subtitleTop ? 1.2 : undefined}>
            {title}
          </Text>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          height="100%"
          gap={actionsGap}
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
          __marginLeft={href ? `calc(var(--mu-spacing-12) + var(--mu-spacing-1))` : 0}
          __marginTop={href ? "-0.6rem" : 0}
        >
          {subtitle}
        </ContextualLine>
      ) : null}
    </TopNavWrapper>
  );
};
