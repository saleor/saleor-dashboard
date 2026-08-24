import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box } from "@saleor/macaw-ui-next";
import { Plus } from "lucide-react";

export const AddNewValueAdornment = (): JSX.Element => (
  <Box
    as="span"
    display="flex"
    alignItems="center"
    paddingRight={2}
    aria-hidden
    data-test-id="add-new-value-icon"
  >
    <Plus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
  </Box>
);
