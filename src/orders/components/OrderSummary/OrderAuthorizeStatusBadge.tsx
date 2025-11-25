import { OrderAuthorizeStatusEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface OrderAuthorizeStatusBadgeProps {
  status: OrderAuthorizeStatusEnum;
}

export const OrderAuthorizeStatusBadge = ({ status }: OrderAuthorizeStatusBadgeProps) => {
  const intl = useIntl();

  switch (status) {
    case OrderAuthorizeStatusEnum.FULL:
      return (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          __backgroundColor="rgba(255, 255, 255, 0.5)"
          __borderColor="rgba(0, 0, 0, 0.3)"
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
          __backgroundColor="white"
          __borderColor="hsla(207, 13%, 87%, 1)"
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
