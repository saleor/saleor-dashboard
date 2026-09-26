import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Dropdown, Input, List, Popover, Text } from "@saleor/macaw-ui-next";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  valueActions: {
    id: "jOcH76",
    defaultMessage: "Value actions",
  },
  moveToTop: {
    id: "iMy+or",
    defaultMessage: "Move to top",
  },
  moveToBottom: {
    id: "HGKQHG",
    defaultMessage: "Move to bottom",
  },
  moveToPosition: {
    id: "CLe1AK",
    defaultMessage: "Move to position…",
  },
  positionLabel: {
    id: "U6qGuO",
    defaultMessage: "Position",
  },
  move: {
    id: "UMbBzo",
    defaultMessage: "Move",
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
  const [positionOpen, setPositionOpen] = useState(false);
  const [position, setPosition] = useState(String(index + 1));

  const commitPosition = () => {
    const nextIndex = Number(position) - 1;

    if (Number.isInteger(nextIndex) && nextIndex >= 0 && nextIndex < count && nextIndex !== index) {
      onMove(nextIndex);
    }

    setPositionOpen(false);
  };

  return (
    <Popover open={positionOpen} onOpenChange={setPositionOpen}>
      <Popover.Anchor>
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              variant="tertiary"
              size="small"
              type="button"
              disabled={disabled}
              data-test-id="attribute-value-menu"
              aria-label={intl.formatMessage(messages.valueActions)}
              icon={
                <EllipsisVertical size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              }
            />
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            <List
              padding={2}
              borderRadius={4}
              boxShadow="defaultOverlay"
              backgroundColor="default1"
            >
              <Dropdown.Item>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  disabled={disabled || index === 0}
                  onClick={() => onMove(0)}
                >
                  <Text>{intl.formatMessage(messages.moveToTop)}</Text>
                </List.Item>
              </Dropdown.Item>
              <Dropdown.Item>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  disabled={disabled || index === count - 1}
                  onClick={() => onMove(count - 1)}
                >
                  <Text>{intl.formatMessage(messages.moveToBottom)}</Text>
                </List.Item>
              </Dropdown.Item>
              <Dropdown.Item>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  disabled={disabled || count < 2}
                  onClick={() => {
                    setPosition(String(index + 1));
                    setPositionOpen(true);
                  }}
                >
                  <Text>{intl.formatMessage(messages.moveToPosition)}</Text>
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
                  <Text color="critical1">{intl.formatMessage(messages.remove)}</Text>
                </List.Item>
              </Dropdown.Item>
            </List>
          </Dropdown.Content>
        </Dropdown>
      </Popover.Anchor>
      <Popover.Content align="end">
        <Box display="flex" alignItems="center" gap={2} padding={2}>
          <Input
            size="small"
            type="number"
            min={1}
            max={count}
            value={position}
            aria-label={intl.formatMessage(messages.positionLabel)}
            onChange={event => setPosition(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitPosition();
              }
            }}
          />
          <Button variant="primary" size="small" type="button" onClick={commitPosition}>
            {intl.formatMessage(messages.move)}
          </Button>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
