import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import { ArrowDown, ArrowUp, EllipsisVertical, X } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  valueActions: {
    id: "jOcH76",
    defaultMessage: "Value actions",
  },
  moveUp: {
    id: "mGjaDZ",
    defaultMessage: "Move up",
    description: "moves a product reference one position up",
  },
  moveDown: {
    id: "ADOU97",
    defaultMessage: "Move down",
    description: "moves a product reference one position down",
  },
  remove: {
    id: "G/yZLu",
    defaultMessage: "Remove",
  },
});

interface SortableChipMenuProps {
  count: number;
  disabled?: boolean;
  index: number;
  onMove: (newIndex: number) => void;
  onRemove: () => void;
}

export const SortableChipMenu = ({
  count,
  disabled,
  index,
  onMove,
  onRemove,
}: SortableChipMenuProps) => {
  const intl = useIntl();
  const iconProps = { size: iconSize.small, strokeWidth: iconStrokeWidthBySize.small };
  const moveUpDisabled = Boolean(disabled) || index === 0;
  const moveDownDisabled = Boolean(disabled) || index === count - 1;

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button
          variant="tertiary"
          size="small"
          type="button"
          disabled={disabled}
          data-test-id="attribute-value-menu"
          aria-label={intl.formatMessage(messages.valueActions)}
          icon={<EllipsisVertical {...iconProps} />}
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
          <Dropdown.Item>
            <List.Item
              borderRadius={4}
              paddingX={1.5}
              paddingY={2}
              opacity={moveUpDisabled ? "0.4" : "1"}
              pointerEvents={moveUpDisabled ? "none" : "auto"}
              aria-disabled={moveUpDisabled}
              onClick={() => {
                if (!moveUpDisabled) {
                  onMove(index - 1);
                }
              }}
              data-test-id="attribute-value-move-up"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <ArrowUp {...iconProps} />
                <Text>{intl.formatMessage(messages.moveUp)}</Text>
              </Box>
            </List.Item>
          </Dropdown.Item>
          <Dropdown.Item>
            <List.Item
              borderRadius={4}
              paddingX={1.5}
              paddingY={2}
              opacity={moveDownDisabled ? "0.4" : "1"}
              pointerEvents={moveDownDisabled ? "none" : "auto"}
              aria-disabled={moveDownDisabled}
              onClick={() => {
                if (!moveDownDisabled) {
                  onMove(index + 1);
                }
              }}
              data-test-id="attribute-value-move-down"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <ArrowDown {...iconProps} />
                <Text>{intl.formatMessage(messages.moveDown)}</Text>
              </Box>
            </List.Item>
          </Dropdown.Item>
          <Dropdown.Item>
            <List.Item
              borderRadius={4}
              paddingX={1.5}
              paddingY={2}
              disabled={disabled}
              onClick={onRemove}
              data-test-id="attribute-value-remove"
            >
              <Box display="flex" alignItems="center" gap={2} color="critical1">
                <X {...iconProps} />
                <Text color="critical1">{intl.formatMessage(messages.remove)}</Text>
              </Box>
            </List.Item>
          </Dropdown.Item>
        </List>
      </Dropdown.Content>
    </Dropdown>
  );
};
