import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Dropdown, List, Text, type TextProps } from "@saleor/macaw-ui-next";
import { CheckSquare, Settings, Square } from "lucide-react";
import { useIntl } from "react-intl";

import { topNavMessages } from "./messages";

interface TopNavMenuItem {
  label: string;
  testId?: string;
  onSelect: <T extends object>(params: T) => void;
  color?: TextProps["color"];
  checked?: boolean;
}

interface TopNavMenuProps {
  items: TopNavMenuItem[];
  dataTestId?: string;
}

export const Menu = ({ items, dataTestId }: TopNavMenuProps) => {
  const intl = useIntl();

  return (
    <Dropdown data-test-id={dataTestId}>
      <Dropdown.Trigger>
        <Button
          icon={<Settings size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          variant="secondary"
          data-test-id="show-more-button"
          title={intl.formatMessage(topNavMessages.moreActions)}
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {items.map(item => (
              <Dropdown.Item key={item.label}>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  onClick={item.onSelect}
                  data-test-id={item.testId}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {item.checked !== undefined &&
                      (item.checked ? (
                        <CheckSquare size={14} aria-hidden />
                      ) : (
                        <Square size={14} aria-hidden />
                      ))}
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
