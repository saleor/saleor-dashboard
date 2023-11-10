import {
  Box,
  ChevronRightIcon,
  List,
  Skeleton,
  sprinkles,
  Text,
} from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HomeNotificationListItemProps {
  dataTestId?: string;
  linkUrl: string;
  children: ReactNode;
  loading: boolean;
}

export const HomeNotificationListItem = ({
  dataTestId,
  linkUrl,
  children,
  loading,
}: HomeNotificationListItemProps) => {
  if (loading) {
    return (
      <Listitem dataTestId={dataTestId}>
        <Box width="100%" paddingX={3} paddingY={6}>
          <Skeleton />
        </Box>
      </Listitem>
    );
  }

  return (
    <Listitem dataTestId={dataTestId}>
      <Link
        className={sprinkles({ width: "100%", paddingX: 3, paddingY: 4 })}
        to={linkUrl}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Text size="small">{children}</Text>
          <ChevronRightIcon />
        </Box>
      </Link>
    </Listitem>
  );
};

function Listitem({
  children,
  dataTestId,
}: {
  children: ReactNode;
  dataTestId?: string;
}) {
  return (
    <List.Item
      borderColor="neutralPlain"
      borderWidth={1}
      borderBottomStyle="solid"
      data-test-id={dataTestId}
    >
      {children}
    </List.Item>
  );
}
