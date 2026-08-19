import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type LucideIcon } from "lucide-react";

import styles from "./VoucherScopeTile.module.css";

interface VoucherScopeTileProps {
  checked: boolean;
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
  disabled?: boolean;
  onSelect: (value: string) => void;
  "data-test-id"?: string;
}

/**
 * Scope choice card — plain button (not Radix RadioGroup).
 * Avoids hidden form `<input type="radio">` bubble inputs that can steal
 * clicks elsewhere on voucher create/details pages.
 */
export const VoucherScopeTile = ({
  checked,
  value,
  title,
  description,
  icon: Icon,
  disabled,
  onSelect,
  "data-test-id": dataTestId,
}: VoucherScopeTileProps): JSX.Element => (
  <Box
    as="button"
    type="button"
    role="radio"
    aria-checked={checked}
    disabled={disabled}
    data-test-id={dataTestId}
    className={clsx(styles.tile, checked && styles.tileChecked)}
    display="flex"
    flexDirection="column"
    gap={1}
    borderStyle="solid"
    borderRadius={3}
    padding={4}
    backgroundColor="default1"
    cursor={disabled ? "not-allowed" : "pointer"}
    onClick={() => {
      if (!disabled) {
        onSelect(value);
      }
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        color={disabled ? "defaultDisabled" : "default1"}
        display="flex"
        flexShrink="0"
        aria-hidden
      >
        <Icon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Box>
      <Text size={3} fontWeight="medium" color={disabled ? "defaultDisabled" : "default1"}>
        {title}
      </Text>
    </Box>
    <Text size={2} color={disabled ? "defaultDisabled" : "default2"} textAlign="left">
      {description}
    </Text>
  </Box>
);
