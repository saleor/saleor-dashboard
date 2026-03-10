import { Box, Text } from "@macaw-ui";

export const NoValue = ({ locale }: { locale: Record<string, string> }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Text>{locale.noValueText}</Text>
    </Box>
  );
};
