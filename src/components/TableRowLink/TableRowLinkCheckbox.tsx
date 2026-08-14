import { Box, Checkbox } from "@saleor/macaw-ui-next";

interface TableRowLinkCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: () => void;
  "data-test-id"?: string;
}

/** Row-select checkbox. Keep it out of any row `<a>` — put the link on the name cell. */
export const TableRowLinkCheckbox = ({
  checked,
  disabled,
  onCheckedChange,
  "data-test-id": dataTestId,
}: TableRowLinkCheckboxProps): JSX.Element => (
  <Box display="flex" alignItems="center" height="100%">
    <Checkbox
      checked={checked}
      disabled={disabled}
      data-test-id={dataTestId}
      onCheckedChange={onCheckedChange}
    />
  </Box>
);
