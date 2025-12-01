import { OrderAuthorizeStatusEnum } from "@dashboard/graphql";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface OrderAuthorizeStatusBadgeProps {
  status: OrderAuthorizeStatusEnum;
}

export const OrderAuthorizeStatusBadge = ({ status }: OrderAuthorizeStatusBadgeProps) => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "defaultDark";

  const neutralColors = {
    background: isDark ? "hsla(0, 0%, 100%, 0.08)" : "hsla(0, 0%, 0%, 0.03)",
    border: isDark ? "hsla(0, 0%, 100%, 0.15)" : "hsla(0, 0%, 0%, 0.12)",
    text: isDark ? "hsla(0, 0%, 100%, 0.8)" : "hsla(0, 0%, 0%, 0.75)",
  };
  const transparentColors = {
    background: "transparent",
    border: isDark ? "hsla(0, 0%, 100%, 0.15)" : "hsla(0, 0%, 0%, 0.15)",
    text: isDark ? "hsla(0, 0%, 100%, 0.7)" : "hsla(0, 0%, 0%, 0.7)",
  };

  switch (status) {
    case OrderAuthorizeStatusEnum.FULL:
      return (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          __backgroundColor={neutralColors.background}
          __borderColor={neutralColors.border}
          __color={neutralColors.text}
          borderStyle="solid"
          borderWidth={1}
          paddingX={2}
          paddingY={1}
          __maxWidth="max-content"
          __borderRadius={500}
        >
          <Text size={2} fontWeight="medium">
            {intl.formatMessage({
              defaultMessage: "Fully authorised",
              id: "wVjyOX",
            })}
          </Text>
        </Box>
      );

    case OrderAuthorizeStatusEnum.NONE:
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
          <Text size={2} fontWeight="medium">
            {intl.formatMessage({
              defaultMessage: "Not fully authorised",
              id: "l1pZJx",
            })}
          </Text>
        </Box>
      );

    case OrderAuthorizeStatusEnum.PARTIAL:
    default:
      return null;
  }
};
