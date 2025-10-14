import plusIcon from "@assets/images/plus-icon.svg";
import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { Box } from "@saleor/macaw-ui-next";

import { SaleorLogo } from "./SaleorLogo";

export const IconsSection = ({ appLogo }: { appLogo: string | undefined }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      padding={2}
      position="relative"
      __width="30rem"
    >
      <Box
        width={12}
        height={12}
        display="flex"
        placeItems="center"
        borderRadius={5}
        overflow="hidden"
      >
        <SaleorLogo />
      </Box>
      <img src={plusIcon} alt="" />

      <AppAvatar
        size={12}
        borderRadius={5}
        logo={
          appLogo
            ? {
                source: appLogo,
              }
            : undefined
        }
      />

      {/* This is a line between Saleor - Plus icon - App logo */}
      <Box
        as="span"
        aria-hidden="true"
        position="absolute"
        __top="50%"
        __height="2px"
        __transform="translateY(-50%)"
        __width="195px"
        __zIndex="-1"
        // Color used by the Plus icon
        __backgroundColor="hsla(0, 0%, 92%, 1)"
      ></Box>
    </Box>
  );
};
