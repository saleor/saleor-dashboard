import { Box } from "@saleor/macaw-ui-next";
import { Image } from "lucide-react";

export const ImagePlaceholder = () => {
  return (
    <Box
      width={10}
      height={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={2}
      borderColor="default1"
      borderStyle="solid"
      borderWidth={1}
      flexShrink="0"
      color="default2"
    >
      <Image size={16} />
    </Box>
  );
};
