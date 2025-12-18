import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { MouseEvent } from "react";
import * as React from "react";

interface FilterPresetItemProps {
  onSelect: (e: MouseEvent<HTMLLIElement>) => void;
  onRemove: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}

export const FilterPresetItem = ({
  children,
  onSelect,
  isActive,
  onRemove,
}: FilterPresetItemProps) => {
  const [hasHover, setHasHover] = React.useState(false);

  return (
    <Dropdown.Item>
      <List.Item
        paddingLeft={1.5}
        paddingRight={8}
        paddingY={1}
        gap={3}
        borderRadius={2}
        position="relative"
        display="flex"
        justifyContent="space-between"
        onClick={onSelect}
        onMouseOver={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
        data-test-id="preset"
      >
        <Text ellipsis fontWeight={isActive ? "bold" : "regular"}>
          {children}
        </Text>
        {hasHover && (
          <Box
            cursor="pointer"
            zIndex="2"
            position="absolute"
            __top="50%"
            right={1.5}
            __transform="translateY(-50%)"
            onClick={onRemove}
            display="flex"
            alignItems="center"
          >
            <X
              data-test-id="preset-delete-button"
              size={iconSize.small}
              strokeWidth={iconStrokeWidthBySize.small}
            />
          </Box>
        )}
      </List.Item>
    </Dropdown.Item>
  );
};
