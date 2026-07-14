import { Box, type vars } from "@saleor/macaw-ui-next";

export const OrderLineGroupBottomSeparator = (): JSX.Element => (
  <Box
    backgroundColor="default1"
    width="100%"
    height={6}
    borderBottomStyle="solid"
    borderBottomWidth={1}
    borderColor="default1"
  />
);

interface OrderLineGroupEndProps {
  showBottomSeparator: boolean;
  backgroundColor: keyof typeof vars.colors.background;
}

export const OrderLineGroupEnd = ({
  showBottomSeparator,
  backgroundColor,
}: OrderLineGroupEndProps): JSX.Element =>
  showBottomSeparator ? (
    <OrderLineGroupBottomSeparator />
  ) : (
    <Box backgroundColor={backgroundColor} paddingBottom={6} />
  );
