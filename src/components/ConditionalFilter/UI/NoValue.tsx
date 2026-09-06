import { Box, Text } from "@saleor/macaw-ui-next";

export const NoValue = ({ locale }: { locale: Record<string, string> }): React.ReactNode => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    paddingY={6}
    data-test-id="filters-empty-state"
  >
    <Text size={3} color="default2">
      {locale.noValueText}
    </Text>
  </Box>
);
