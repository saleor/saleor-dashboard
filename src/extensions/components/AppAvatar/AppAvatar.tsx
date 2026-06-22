import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { type AppLogo } from "@dashboard/extensions/types";
import { Box, type BoxProps } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";

type Logo = AppLogo | undefined;
type Size = 4 | 6 | 8 | 12;

export const AppAvatar = ({
  logo,
  size = 8,
  variant = "default",
  ...props
}: { logo?: Logo; size?: Size; variant?: "default" | "plain" } & BoxProps) => {
  if (logo) {
    return (
      <Box
        width={size}
        height={size}
        display="flex"
        placeItems="center"
        borderRadius={variant === "plain" ? undefined : 2}
        overflow="hidden"
        {...props}
      >
        <Box as="img" src={logo.source} width="100%" />
      </Box>
    );
  }

  if (variant === "plain") {
    return (
      <Box width={size} height={size} display="flex" placeItems="center" {...props}>
        <Package size={iconSize.medium} strokeWidth={iconStrokeWidth} />
      </Box>
    );
  }

  return (
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
      <Package size={iconSize.medium} strokeWidth={iconStrokeWidth} />
    </Box>
  );
};
