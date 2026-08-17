import { iconSize, iconStrokeWidth, iconStrokeWidthBySize } from "@dashboard/components/icons";
import {
  Box,
  type BoxProps,
  Button,
  type ButtonProps,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import styles from "./ButtonGroupWithDropdown.module.css";

export interface ButtonGroupDropdownOption {
  label: string;
  testId?: string;
  onSelect: <T extends object>(params: T) => void;
}

interface ButtonGroupWithDropdownProps extends Omit<BoxProps, "size"> {
  onClick?: () => void;
  options: ButtonGroupDropdownOption[];
  /** First-party actions, rendered above `options` with a separator when both exist. */
  pinnedOptions?: ButtonGroupDropdownOption[];
  testId?: string;
  disabled?: boolean;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

const renderDropdownItems = (
  items: ButtonGroupDropdownOption[],
  keyPrefix: string,
): JSX.Element[] =>
  items.map((item, idx) => (
    <Dropdown.Item key={`${keyPrefix}-${idx}`}>
      <List.Item
        borderRadius={4}
        paddingX={1.5}
        paddingY={2}
        onClick={item.onSelect}
        data-test-id={item.testId}
      >
        <Text>{item.label}</Text>
      </List.Item>
    </Dropdown.Item>
  ));

export const ButtonGroupWithDropdown = ({
  children,
  options,
  pinnedOptions = [],
  onClick,
  disabled = false,
  testId,
  variant = "primary",
  size,
  className,
  ...boxProps
}: ButtonGroupWithDropdownProps): JSX.Element => {
  const showSeparator = pinnedOptions.length > 0 && options.length > 0;
  const chevronSize = size === "small" ? iconSize.small : iconSize.medium;
  const chevronStroke = size === "small" ? iconStrokeWidthBySize.small : iconStrokeWidth;

  return (
    <Dropdown>
      <Box
        className={clsx(styles.group, className)}
        data-variant={variant}
        data-disabled={disabled || undefined}
        data-size={size}
        {...boxProps}
      >
        <Button
          className={styles.segment}
          variant={variant}
          size={size}
          type="button"
          onClick={onClick}
          data-test-id={testId}
          disabled={disabled}
        >
          {children}
        </Button>

        <Box aria-hidden className={styles.divider} data-variant={variant} />

        <Dropdown.Trigger>
          <Button
            className={styles.segment}
            variant={variant}
            size={size}
            type="button"
            icon={<ChevronDown size={chevronSize} strokeWidth={chevronStroke} />}
            disabled={disabled}
            data-test-id={testId ? `${testId}-dropdown` : undefined}
          />
        </Dropdown.Trigger>
      </Box>

      <Dropdown.Content align="end">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {renderDropdownItems(pinnedOptions, "pinned")}
            {showSeparator ? (
              <Box
                role="separator"
                borderColor="default1"
                borderTopStyle="solid"
                borderTopWidth={1}
                marginY={1}
                marginX={1}
              />
            ) : null}
            {renderDropdownItems(options, "option")}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};
