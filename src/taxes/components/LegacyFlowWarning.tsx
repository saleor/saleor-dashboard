import { Box, Text, WarningIcon } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const LegacyFlowWarning = ({
  taxCalculationStrategy,
}: {
  taxCalculationStrategy: string;
}) => {
  const intl = useIntl();

  if (taxCalculationStrategy !== "legacy-flow") {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      backgroundColor="warning1"
      color="warning1"
      padding={2}
      gap={1}
      borderRadius={3}
      marginTop={1}
      marginBottom={1}
    >
      <WarningIcon size="small" color="warning1" />
      <Text size={2} color="warning1">
        {intl.formatMessage({
          defaultMessage: "Legacy flow detected -  select tax strategy from dropdown",
          id: "k20lqw",
        })}
      </Text>
    </Box>
  );
};
