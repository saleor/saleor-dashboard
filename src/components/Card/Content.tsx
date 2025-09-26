import { Box, PropsWithBox } from "@saleor/macaw-ui-next";

export const Content = ({ children, ...rest }: PropsWithBox<{}>) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
