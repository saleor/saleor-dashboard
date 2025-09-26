import { Box, PropsWithBox } from "@saleor/macaw-ui-next";

export const Actions = ({ children, className, style, ...rest }: PropsWithBox<{}>) => (
  <Box
    display="flex"
    flexDirection="row"
    gap={2}
    alignItems="center"
    justifyContent="flex-start"
    paddingX={6}
    paddingY={4}
    className={className}
    style={style}
    {...rest}
  >
    {children}
  </Box>
);
