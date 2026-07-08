import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import {
  Box,
  type BoxProps,
  Button,
  type ButtonProps,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui-next";
import { ChevronDown } from "lucide-react";

import styles from "./ButtonGroupWithDropdown.module.css";

interface ButtonGroupWithDropdownProps extends BoxProps {
  onClick?: () => void;
  options: Array<{
    label: string;
    testId?: string;
    onSelect: <T extends object>(params: T) => void;
  }>;
  testId?: string;
  disabled?: boolean;
  variant?: ButtonProps["variant"];
}

// TODO: consider moving this to Macaw UI
export const ButtonGroupWithDropdown = ({
  children,
  options,
  onClick,
  disabled = false,
  testId,
  variant,
  ...boxProps
}: ButtonGroupWithDropdownProps) => {
  return (
    <Dropdown>
      <Box className={styles.group} {...boxProps}>
        <Button
          className={styles.segment}
          variant={variant}
          onClick={onClick}
          data-test-id={testId}
          disabled={disabled}
        >
          {children}
        </Button>

        <Box aria-hidden className={styles.divider} />

        <Dropdown.Trigger>
          <Button
            className={styles.segment}
            variant={variant}
            icon={<ChevronDown size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
            disabled={disabled}
          />
        </Dropdown.Trigger>
      </Box>

      <Dropdown.Content align="end">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {options.map((item, idx) => (
              <Dropdown.Item key={`button-group-dropdown-item-${idx}`}>
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
            ))}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};
