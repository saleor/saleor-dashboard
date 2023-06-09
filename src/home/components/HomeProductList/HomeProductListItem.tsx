import { Box, List, sprinkles } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HomeNotificationListItemProps {
  dataTestId?: string;
  linkUrl: string;
  children: ReactNode;
}

export const HomeProductListItem = ({
  dataTestId,
  linkUrl,
  children,
}: HomeNotificationListItemProps) => (
  <List.Item
    borderColor="neutralPlain"
    borderWidth={1}
    padding={3}
    borderBottomStyle="solid"
    data-test-id={dataTestId}
  >
    <Link className={sprinkles({ width: "100%" })} to={linkUrl}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {children}
      </Box>
    </Link>
  </List.Item>
);
