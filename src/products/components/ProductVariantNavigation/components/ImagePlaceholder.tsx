import { ImageIcon } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";

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
    >
      <ImageIcon />
    </Box>
  );
};
