import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import { type MouseEvent, type ReactNode } from "react";

import styles from "./SettingsToggleRow.module.css";

interface SettingsToggleRowProps {
  name: string;
  title: ReactNode;
  description?: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  "data-test-id"?: string;
}

const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest("a, button, input, textarea, select, [role='checkbox'], [role='link']"),
  );
};

/**
 * Settings row with label stack on the left and control on the right.
 * Shared across Settings hubs without layout change.
 */
export const SettingsToggleRow = ({
  name,
  title,
  description,
  checked,
  disabled = false,
  onCheckedChange,
  id,
  "data-test-id": dataTestId,
}: SettingsToggleRowProps): JSX.Element => {
  const handleRowClick = (event: MouseEvent): void => {
    if (disabled || isInteractiveTarget(event.target)) {
      return;
    }

    onCheckedChange(!checked);
  };

  return (
    <Box
      id={id}
      className={styles.row}
      data-disabled={disabled ? "true" : undefined}
      display="flex"
      alignItems="flex-start"
      justifyContent="space-between"
      gap={4}
      paddingX={6}
      paddingY={4}
      onClick={disabled ? undefined : handleRowClick}
      cursor={disabled ? "not-allowed" : "pointer"}
    >
      <Box display="flex" flexDirection="column" gap={1} __minWidth={0} flexGrow="1">
        <Text size={3} fontWeight="medium" color="default1">
          {title}
        </Text>
        {description ? (
          <Text size={2} color="default2" className={styles.description}>
            {description}
          </Text>
        ) : null}
      </Box>
      <Box flexShrink="0" paddingTop={0.5} onClick={(event: MouseEvent) => event.stopPropagation()}>
        <Checkbox
          name={name}
          checked={checked}
          disabled={disabled}
          onCheckedChange={value => onCheckedChange(value === true)}
          data-test-id={dataTestId}
        />
      </Box>
    </Box>
  );
};
