import { OrderChargeStatusEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { BanknoteIcon } from "lucide-react";
import { useIntl } from "react-intl";

interface OrderChargeStatusBadgeProps {
  status: OrderChargeStatusEnum;
}

export const OrderChargeStatusBadge = ({ status }: OrderChargeStatusBadgeProps) => {
  const intl = useIntl();

  switch (status) {
    case OrderChargeStatusEnum.FULL:
      return (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          __backgroundColor="hsla(152, 100%, 85%, 1)"
          __borderColor="hsla(152, 98%, 44%, 1)"
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
          __backgroundColor="hsla(37, 100%, 85%, 1)"
          __borderColor="hsla(30, 98%, 44%, 0.37)"
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
          __backgroundColor="white"
          __borderColor="hsla(207, 13%, 87%, 1)"
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
