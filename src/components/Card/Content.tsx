import { Box, type PropsWithBox } from "@macaw-ui";

export const Content = ({ children, ...rest }: PropsWithBox<{}>) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
