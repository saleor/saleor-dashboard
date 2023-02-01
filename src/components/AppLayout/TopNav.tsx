import { ArrowBack } from "@material-ui/icons";
import { Box, sprinkles, Text } from "@saleor/macaw-ui/next";
import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface TopNavProps {
  title: string | React.ReactNode;
  href?: string;
}

export const TopNav: React.FC<PropsWithChildren<TopNavProps>> = ({
  title,
  href,
  children,
}) => (
  <Box
    display="flex"
    alignItems="center"
    paddingX={9}
    paddingY={7}
    borderBottomWidth={1}
    borderBottomStyle="solid"
    borderColor="neutralPlain"
    position="relative"
    __gridArea="nav"
  >
    {href && (
      <Link
        to={href}
        className={sprinkles({
          borderColor: "neutralPlain",
          borderStyle: "solid",
          borderWidth: 1,
          padding: 4,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 7,
        })}
      >
        <ArrowBack />
      </Link>
    )}
    <Box
      // @ts-ignore
      __flex={1}
    >
      <Text variant="title">{title}</Text>
    </Box>
    <Box display="flex" flexWrap="nowrap">
      {children}
    </Box>
  </Box>
);
