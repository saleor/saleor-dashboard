import { Box, type BoxProps } from "@macaw-ui";

export const Divider = (props: BoxProps) => {
  return (
    <Box
      width="100%"
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderColor="default1"
      height={1}
      {...props}
    />
  );
};
