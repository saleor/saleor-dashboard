import { Box, Checkbox } from "@saleor/macaw-ui-next";

import { stopTableRowLinkNavigation } from "./stopTableRowLinkNavigation";

interface TableRowLinkCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: () => void;
  "data-test-id"?: string;
}

/**
 * Row-select checkbox. Macaw/Radix stop the button click inside `<form>`, so a
 * parent or overlapping name `<a>` would navigate unless we cancel default here.
 * Do not toggle in this handler — Radix already fired `onCheckedChange`.
 */
export const TableRowLinkCheckbox = ({
  checked,
  disabled,
  onCheckedChange,
  "data-test-id": dataTestId,
}: TableRowLinkCheckboxProps): JSX.Element => (
  <Box
    display="flex"
    alignItems="center"
    height="100%"
    position="relative"
    onMouseDown={stopTableRowLinkNavigation}
    onClick={stopTableRowLinkNavigation}
  >
    <Checkbox
      checked={checked}
      disabled={disabled}
      data-test-id={dataTestId}
      onCheckedChange={onCheckedChange}
    />
  </Box>
);
