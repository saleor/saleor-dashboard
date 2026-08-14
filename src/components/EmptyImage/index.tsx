import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box } from "@saleor/macaw-ui-next";
import { Image } from "lucide-react";

export const EmptyImage = (): JSX.Element => (
  <Box
    __width="31px"
    __height="31px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius={3}
    borderColor="default1"
    borderStyle="solid"
    borderWidth={1}
    color="default2"
    flexShrink="0"
    data-test-id="empty-image"
  >
    <Image size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} aria-hidden />
  </Box>
);
