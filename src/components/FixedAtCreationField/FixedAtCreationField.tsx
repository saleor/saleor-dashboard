import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Input } from "@saleor/macaw-ui-next";
import { Lock } from "lucide-react";

interface FixedAtCreationFieldProps {
  "data-test-id"?: string;
  helperText: string;
  label: string;
  name?: string;
  value: string;
}

/**
 * Immutable identity chosen at create time (currency, attribute input type).
 * Disabled macaw Input + lock + helper — not a disabled Combobox/Select.
 */
export const FixedAtCreationField = ({
  "data-test-id": dataTestId,
  helperText,
  label,
  name,
  value,
}: FixedAtCreationFieldProps): JSX.Element => (
  <Input
    data-test-id={dataTestId}
    disabled
    endAdornment={
      <Box display="flex" alignItems="center" color="default2" paddingRight={1} aria-hidden>
        <Lock size={iconSize.small} strokeWidth={iconStrokeWidth} />
      </Box>
    }
    helperText={helperText}
    label={label}
    name={name}
    value={value}
  />
);
