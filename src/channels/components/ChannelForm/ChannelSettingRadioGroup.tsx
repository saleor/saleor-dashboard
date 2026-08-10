import { Box, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./ChannelSettingRadioGroup.module.css";

export interface ChannelSettingRadioOption<T extends string> {
  value: T;
  label: ReactNode;
  description: ReactNode;
  /** Optional pill next to the label (e.g. Recommended / Legacy). */
  badge?: ReactNode;
}

interface ChannelSettingRadioGroupProps<T extends string> {
  title: ReactNode;
  description: ReactNode;
  value: T;
  options: Array<ChannelSettingRadioOption<T>>;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  testId?: string;
  name: string;
}

export const ChannelSettingRadioGroup = <T extends string>({
  title,
  description,
  value,
  options,
  onValueChange,
  disabled,
  testId,
  name,
}: ChannelSettingRadioGroupProps<T>) => (
  <Box className={styles.row} data-test-id={testId}>
    <Box className={styles.copy}>
      <Text size={3} fontWeight="medium">
        {title}
      </Text>
      <Text size={2} color="default2">
        {description}
      </Text>
    </Box>
    <RadioGroup
      name={name}
      value={value}
      disabled={disabled}
      onValueChange={next => onValueChange(next as T)}
      className={styles.options}
      size="small"
    >
      {options.map(option => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          id={`${name}-${option.value}`}
          disabled={disabled}
          data-test-id={`${testId}-${option.value}`}
          alignItems="flex-start"
          /* Dashboard global: nudges the control down to optically center with the label line. */
          className={`simple-radio-group ${styles.optionItem}`}
        >
          <Box className={styles.optionCopy}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Text size={3} fontWeight="medium" as="span">
                {option.label}
              </Text>
              {option.badge}
            </Box>
            <Text size={2} color="default2" as="span">
              {option.description}
            </Text>
          </Box>
        </RadioGroup.Item>
      ))}
    </RadioGroup>
  </Box>
);
