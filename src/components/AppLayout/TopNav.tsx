import { ArrowLeftIcon, Box, sprinkles, Text } from "@saleor/macaw-ui/next";
import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import useAppChannel from "./AppChannelContext";
import AppChannelSelect from "./AppChannelSelect";
import { topBarHeight } from "./consts";

interface TopNavProps {
  title: string | React.ReactNode;
  href?: string;
}

export const TopNav: React.FC<PropsWithChildren<TopNavProps>> = ({ title, href, children }) => {
  const { availableChannels, channel, isPickerActive, setChannel } = useAppChannel(false);

  return (
    <Box
      display="flex"
      alignItems="center"
      paddingX={9}
      paddingRight={9}
      paddingY={8}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="neutralPlain"
      position="relative"
      __gridArea="nav"
      data-test-id="page-header"
      __height={topBarHeight}
    >
      {href && (
        <Link
          to={href}
          data-test-id="app-header-back-button"
          className={sprinkles({
            borderColor: "neutralPlain",
            borderStyle: "solid",
            borderWidth: 1,
            padding: 5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 7,
          })}
        >
          <ArrowLeftIcon />
        </Link>
      )}
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
    </Box>
  );
};
