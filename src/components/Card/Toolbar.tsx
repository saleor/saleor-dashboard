import { Box, PropsWithBox } from "@saleor/macaw-ui-next";

export const Toolbar = ({ children, ...rest }: PropsWithBox<{}>) => (
  <Box display="flex" flexDirection="row" gap={2} {...rest}>
    {children}
  </Box>
);
