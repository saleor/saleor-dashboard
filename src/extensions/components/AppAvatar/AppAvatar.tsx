import { AppLogo } from "@dashboard/extensions/types";
import { Box, BoxProps, GenericAppIcon } from "@saleor/macaw-ui-next";

type Logo = AppLogo | undefined;
type Size = 4 | 6 | 8 | 12;

export const AppAvatar = ({ logo, size = 8, ...props }: { logo?: Logo; size?: Size } & BoxProps) =>
  logo ? (
    <Box
      width={size}
      height={size}
      display="flex"
      placeItems="center"
      borderRadius={2}
      overflow="hidden"
      {...props}
    >
      <Box as="img" src={logo.source} width="100%" />
    </Box>
  ) : (
    <Box
      backgroundColor="default2"
      width={size}
      height={size}
      display="flex"
      placeItems="center"
      borderRadius={2}
      borderWidth={1}
      borderColor="default1"
      borderStyle="solid"
      overflow="hidden"
      {...props}
    >
      <GenericAppIcon size="medium" color="default2" />
    </Box>
  );
