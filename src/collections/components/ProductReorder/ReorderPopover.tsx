import { Box, Button, Input, Popover, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { CollectionProducts, keepProductOrder } from "../CollectionProducts/keepProductOrder";
import { useProductReorder } from "../CollectionProducts/useProductReorder";

interface ReorderPopoverProps {
  listElements: string[];
  collectionProducts: CollectionProducts;
}

export const ReorderPopover = ({ listElements, collectionProducts }: ReorderPopoverProps) => {
  const [position, setPosition] = useState(1);
  const { move } = useProductReorder();
  const orderElementsByPosition = keepProductOrder(listElements, collectionProducts);

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);

    if (value <= 1) return;

    setPosition(value);
  };

  const handleMoveUp = () => {
    move(orderElementsByPosition(position), position);
  };

  const handleMoveDown = () => {
    move(orderElementsByPosition(-position), -position);
  };

  return (
    <Popover>
      <Popover.Trigger>
        <Button size="small" variant="secondary">
          <FormattedMessage id="kGQJcD" defaultMessage="Reorder" />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Box padding={2} __width="300px">
          <Popover.Arrow fill="default1" />
          <Text display="block" width="100%" fontWeight="medium">
            <FormattedMessage id="wPayk9" defaultMessage="Reorder selected products" />
          </Text>
          <Text display="block" width="100%" size={2} fontWeight="light" marginBottom={3}>
            <FormattedMessage id="32uBJ8" defaultMessage="Move products by their positions." />
          </Text>

          <Text display="block" width="100%" size={3} fontWeight="medium" paddingY={1}>
            <FormattedMessage id="zpbMmC" defaultMessage="Move by positions" />
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
                <FormattedMessage id="wmFdws" defaultMessage="Move up" />
              </Button>
              <Button size="small" variant="secondary" onClick={handleMoveDown}>
                <FormattedMessage id="H/r5m6" defaultMessage="Move down" />
              </Button>
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={5}>
            <Popover.Close>
              <Button variant="tertiary" size="small">
                <FormattedMessage id="rbrahO" defaultMessage="Close" />
              </Button>
            </Popover.Close>
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
