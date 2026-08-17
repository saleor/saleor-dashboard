import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";
import { type AssignProductPicker } from "./useAssignProductPicker";

interface AssignProductPickerSelectAllProps {
  picker: AssignProductPicker;
}

export const AssignProductPickerSelectAll = ({ picker }: AssignProductPickerSelectAllProps) => {
  const classes = useStyles({});
  const {
    handleToggleSelectAllVisible,
    hasMore,
    selectAllCheckboxState,
    showSelectAll,
    showSelectAllScrollHint,
  } = picker;

  if (!showSelectAll) {
    return null;
  }

  return (
    <Box className={classes.selectAllRow} display="flex" flexDirection="column" gap={1}>
      <ControlledCheckbox
        checked={selectAllCheckboxState.checked}
        indeterminate={selectAllCheckboxState.indeterminate}
        name="selectAllMatchingProducts"
        testId="assign-product-select-all"
        label={
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...messages.selectAllMatchingProducts} />
          </Text>
        }
        onChange={handleToggleSelectAllVisible}
      />
      {showSelectAllScrollHint && hasMore ? (
        <Text size={1} color="default2">
          <FormattedMessage {...messages.selectAllScrollHint} />
        </Text>
      ) : null}
    </Box>
  );
};
