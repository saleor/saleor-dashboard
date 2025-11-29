import { OrderChargeStatusEnum } from "@dashboard/graphql";
import { getStatusColor } from "@dashboard/misc";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import { BanknoteIcon } from "lucide-react";
import { useIntl } from "react-intl";

interface OrderChargeStatusBadgeProps {
  status: OrderChargeStatusEnum;
}

export const OrderChargeStatusBadge = ({ status }: OrderChargeStatusBadgeProps) => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "defaultDark";

  const successColors = getStatusColor({ status: "success", currentTheme });
  const warningColors = getStatusColor({ status: "warning", currentTheme });
  const transparentColors = {
    background: "transparent",
    border: isDark ? "hsla(0, 0%, 100%, 0.15)" : "hsla(0, 0%, 0%, 0.15)",
    text: isDark ? "hsla(0, 0%, 100%, 0.7)" : "hsla(0, 0%, 0%, 0.7)",
  };

  switch (status) {
    case OrderChargeStatusEnum.FULL:
      return (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          __backgroundColor={successColors.base}
          __borderColor={successColors.border}
          __color={successColors.text}
          borderStyle="solid"
          borderWidth={1}
          paddingX={2}
          paddingY={1}
          __maxWidth="max-content"
          __borderRadius={500}
        >
          <BanknoteIcon size={16} />
          <Text size={2} fontWeight="medium">
            {intl.formatMessage({
              defaultMessage: "Fully charged",
              id: "Ynjq+C",
            })}
          </Text>
        </Box>
      );

    case OrderChargeStatusEnum.OVERCHARGED:
      return (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          __backgroundColor={warningColors.base}
          __borderColor={warningColors.border}
          __color={warningColors.text}
          borderStyle="solid"
          borderWidth={1}
          paddingX={2}
          paddingY={1}
          __maxWidth="max-content"
          __borderRadius={500}
        >
          <BanknoteIcon size={16} />
          <Text size={2} fontWeight="medium">
            {intl.formatMessage({
              defaultMessage: "Overcharged",
              id: "8Cjxdt",
            })}
          </Text>
        </Box>
      );

    case OrderChargeStatusEnum.PARTIAL:
    case OrderChargeStatusEnum.NONE:
      return (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          __backgroundColor={transparentColors.background}
          __borderColor={transparentColors.border}
          __color={transparentColors.text}
          borderStyle="solid"
          borderWidth={1}
          paddingX={2}
          paddingY={1}
          __maxWidth="max-content"
          __borderRadius={500}
        >
          <BanknoteIcon size={16} />
          <Text size={2} fontWeight="medium">
            {intl.formatMessage({
              defaultMessage: "Not fully charged",
              id: "X9tptP",
            })}
          </Text>
        </Box>
      );

    default:
      return null;
  }
};
