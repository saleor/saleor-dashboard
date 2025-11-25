import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

type Props = {
  description: string;
};

export const OrderValueHeader = ({ description }: Props) => {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start">
      <Box display="flex" flexDirection="column">
        <Text fontWeight="medium" fontSize={6}>
          {intl.formatMessage({
            defaultMessage: "Order value",
            id: "fL08MU",
          })}
        </Text>
        <Text color="default2" size={2} marginTop={1}>
          {description}
        </Text>
      </Box>
    </Box>
  );
};
