import { Box, type PropsWithBox } from "@macaw-ui";

export const Toolbar = ({ children, ...rest }: PropsWithBox<{}>) => (
  <Box display="flex" flexDirection="row" gap={2} {...rest}>
    {children}
  </Box>
);
