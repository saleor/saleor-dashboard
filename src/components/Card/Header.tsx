import { Box, type PropsWithBox } from "@macaw-ui";

export const Header = ({ children, className, ...rest }: PropsWithBox<{}>) => (
  <Box
    paddingX={6}
    paddingTop={6}
    className={className}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    {...rest}
  >
    {children}
  </Box>
);
