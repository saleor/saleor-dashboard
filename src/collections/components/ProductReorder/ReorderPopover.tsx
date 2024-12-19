import { Box, Button, Input, Popover, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

import { useProductReorder } from "../CollectionProducts/useProductReorder";

interface ReorderPopoverProps {
  listElements: string[];
  onReorder: () => void;
}

export const ReorderPopover = ({ listElements, onReorder }: ReorderPopoverProps) => {
  const [position, setPosition] = useState(1);
  const { move } = useProductReorder();

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);

    if (value <= 1) return;

    setPosition(value);
  };

  const handleMoveUp = () => {
    move(listElements, position);
    onReorder();
  };

  const handleMoveDown = () => {
    move(listElements, -position);
    onReorder();
  };

  return (
    <Popover>
      <Popover.Trigger>
        <Button size="small" variant="secondary">
          Reorder
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Box padding={2} __width="300px">
          <Popover.Arrow fill="default1" />
          <Text display="block" width="100%" fontWeight="medium">
            Reorder selected products
          </Text>
          <Text display="block" width="100%" size={2} fontWeight="light" marginBottom={3}>
            Move products by their positions.
          </Text>

          <Text display="block" width="100%" size={3} fontWeight="medium" paddingY={1}>
            Move by positions
          </Text>
          <Box display="flex" gap={5}>
            <Input
              height={3}
              type="number"
              placeholder="2"
              value={position}
              onChange={handlePositionChange}
            />
            <Box display="flex" alignItems="center" gap={2} flexShrink="0">
              <Button size="small" variant="secondary" onClick={handleMoveUp}>
                Move up
              </Button>
              <Button size="small" variant="secondary" onClick={handleMoveDown}>
                Move down
              </Button>
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={5}>
            <Popover.Close>
              <Button variant="tertiary" size="small">
                Close
              </Button>
            </Popover.Close>
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
