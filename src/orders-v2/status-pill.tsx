import { PillStatusType } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";

const getFillColorsBasedOnStatus = (status: PillStatusType) => {
  switch (status) {
    case "success":
      return {
        __backgroundColor: "oklch(94% 0.0898 164deg)",
        __borderColor: "oklch(79% 0.204 153deg)",
      };
    case "error":
      return {
        __backgroundColor: "oklch(87.1% 0.078 354deg)",
        __borderColor: "oklch(78.4% 0.142 356deg)",
      };
    case "warning": {
      return {
        __backgroundColor: "oklch(95.8% 0.0729 96.6deg)",
        __borderColor: "oklch(87.3% 0.179 92.2deg)",
      };
    }
  }
};

// TODO: move to MacawUI
export const StatusPill = ({
  status,
  children,
}: {
  status: PillStatusType;
  children: React.ReactNode;
}) => {
  return (
    <Box
      paddingX={3}
      paddingY={1}
      borderRadius={6}
      borderWidth={1}
      borderStyle="solid"
      data-test-id="status-info"
      data-macaw-ui-candidate
      whiteSpace="nowrap"
      {...getFillColorsBasedOnStatus(status)}
    >
      <Text color="default1" fontWeight="medium" size={2}>
        {children}
      </Text>
    </Box>
  );
};
