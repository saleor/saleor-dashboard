import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";

import { AttributeInputTypeIcon } from "./AttributeInputTypeIcon";
import styles from "./AttributeInputTypeOptionAdornment.module.css";
import { type AttributeInputTypeIconSize } from "./types";

interface AttributeInputTypeOptionAdornmentProps {
  inputType: AttributeInputTypeEnum;
  size?: AttributeInputTypeIconSize;
}

export const AttributeInputTypeOptionAdornment = ({
  inputType,
  size = "xsmall",
}: AttributeInputTypeOptionAdornmentProps) => {
  return (
    <Box className={styles.option}>
      <AttributeInputTypeIcon inputType={inputType} size={size} />
    </Box>
  );
};
