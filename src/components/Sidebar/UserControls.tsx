import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { useUser } from "@dashboard/auth";
import { getUserName } from "@dashboard/misc";
import { Box, MoreOptionsIcon, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const UserControls = () => {
  const { user } = useUser();

  return (
    <Box
      display="flex"
      gap={5}
      paddingX={6}
      paddingY={7}
      alignItems="center"
      borderTopWidth={1}
      borderColor="neutralPlain"
      borderTopStyle="solid"
      justifyContent="space-between"
    >
      <Box display="flex" gap={5} alignItems="center">
        {/* TODO: use Avatar when https://github.com/saleor/macaw-ui/pull/225 is merged */}
        <Box
          __width="32px"
          __height="32px"
          __borderRadius="50%"
          as="img"
          src={sideBarDefaultLogo}
          alt="Saleor dashboard logo"
        />
        <Text variant="bodyEmp" size="medium" as="p">
          {getUserName(user, true)}
        </Text>
      </Box>
      <Box cursor="pointer" display="flex" justifyContent="center">
        <MoreOptionsIcon />
      </Box>
    </Box>
  );
};
