import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Dropdown, List, Text, type TextProps } from "@saleor/macaw-ui-next";
import { CheckSquare, Settings, Square } from "lucide-react";
import type * as React from "react";
import { useIntl } from "react-intl";

import { topNavMessages } from "./messages";

export interface TopNavMenuItem {
  label: string;
  testId?: string;
  onSelect: <T extends object>(params: T) => void;
  color?: TextProps["color"];
  checked?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TopNavMenuProps {
  items: TopNavMenuItem[];
  dataTestId?: string;
  trigger?: React.ReactNode;
}

const menuItemIconStyle: React.CSSProperties = {
  alignItems: "center",
  display: "inline-flex",
  flexShrink: 0,
  height: iconSize.small,
  justifyContent: "center",
  lineHeight: 0,
  width: iconSize.small,
};

export const Menu = ({ items, dataTestId, trigger }: TopNavMenuProps) => {
  const intl = useIntl();

  return (
    <Dropdown data-test-id={dataTestId}>
      <Dropdown.Trigger>
        {trigger ?? (
          <Button
            icon={<Settings size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            variant="secondary"
            data-test-id="show-more-button"
            title={intl.formatMessage(topNavMessages.moreActions)}
          />
        )}
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {items.map(item => (
              <Dropdown.Item key={item.testId ?? item.label}>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  onClick={item.disabled ? undefined : item.onSelect}
                  data-test-id={item.testId}
                  aria-disabled={item.disabled || undefined}
                  style={
                    item.disabled
                      ? { cursor: "not-allowed", opacity: 0.5, pointerEvents: "none" }
                      : undefined
                  }
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {item.checked !== undefined &&
                      (item.checked ? (
                        <CheckSquare size={14} aria-hidden />
                      ) : (
                        <Square size={14} aria-hidden />
                      ))}
                    {item.icon && (
                      <Box color={item.color} style={menuItemIconStyle}>
                        {item.icon}
                      </Box>
                    )}
                    <Text color={item.color}>{item.label}</Text>
                  </Box>
                </List.Item>
              </Dropdown.Item>
            ))}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};
