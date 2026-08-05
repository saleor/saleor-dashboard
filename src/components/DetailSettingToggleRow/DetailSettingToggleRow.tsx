import { Box, Text, Toggle } from "@saleor/macaw-ui-next";
import { type KeyboardEvent, type ReactNode } from "react";

import styles from "./DetailSettingToggleRow.module.css";

interface DetailSettingToggleRowProps {
  title: ReactNode;
  description: ReactNode;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
  testId?: string;
  /** Inline callout under the title row (stays inside card padding). */
  notice?: ReactNode;
  children?: ReactNode;
}

/**
 * Boolean setting row for entity detail `DetailSettingsCard` (`contentFlush`).
 * Title + description left, Toggle right; optional nested fields when on.
 */
export const DetailSettingToggleRow = ({
  title,
  description,
  pressed,
  onPressedChange,
  disabled,
  testId,
  notice,
  children,
}: DetailSettingToggleRowProps): JSX.Element => {
  const toggle = () => {
    if (!disabled) {
      onPressedChange(!pressed);
    }
  };

  const handleCopyKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <Box className={styles.row} data-test-id={testId}>
      <Box className={styles.header}>
        {/* role=button (not <button>): pills are divs; Toggle is mouse-only to avoid dual tab stops */}
        <Box
          className={styles.copyButton}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-pressed={pressed}
          aria-disabled={disabled || undefined}
          onClick={toggle}
          onKeyDown={handleCopyKeyDown}
        >
          <Text size={3} fontWeight="medium" as="span">
            {title}
          </Text>
          <Text size={2} color="default2" as="span">
            {description}
          </Text>
        </Box>
        <Toggle
          pressed={pressed}
          onPressedChange={onPressedChange}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
        />
      </Box>
      {notice ? <Box className={styles.notice}>{notice}</Box> : null}
      {children ? <Box className={styles.nested}>{children}</Box> : null}
    </Box>
  );
};

export const DetailSettingNestedField = ({ children }: { children: ReactNode }): JSX.Element => (
  <Box className={styles.nestedField}>{children}</Box>
);
