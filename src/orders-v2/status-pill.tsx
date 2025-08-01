import { PillStatusType } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

// TODO: move to MacawUI
export const StatusPill = ({
  status,
  children,
}: {
  status: PillStatusType;
  children: React.ReactNode;
}) => {
  const getFillColorsBasedOnStatus = (status: PillStatusType) => {
    switch (status) {
      case "success":
        return {
          __backgroundColor: "oklch(0.92 0.16 145)",
          __borderColor: "oklch(0.72 0.27 145)",
        };
    }
  };

  return (
    <Box
      paddingX={2}
      paddingY={1}
      borderRadius={6}
      borderWidth={1}
      borderStyle="solid"
      data-test-id="status-info"
      data-macaw-ui-candidate
      {...getFillColorsBasedOnStatus(status)}
    >
      <Text color="default1" fontWeight="medium" size={2}>
        {children}
      </Text>
    </Box>
  );
};
