import {
  Box,
  Dropdown,
  List,
  RemoveIcon,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

interface FilterPresetItemProps {
  onSelect: () => void;
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
    <Box
      onMouseOver={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
    >
      <Dropdown.Item>
        <List.Item
          paddingX={4}
          paddingY={3}
          gap={6}
          borderRadius={2}
          display="flex"
          justifyContent="space-between"
          onClick={onSelect}
        >
          <Text variant={isActive ? "bodyStrong" : "body"}>{children}</Text>
          {hasHover && (
            <Box
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
              display="flex"
              alignItems="center"
            >
              <RemoveIcon
                className={sprinkles({
                  color: {
                    default: "iconNeutralSubdued",
                    hover: "iconNeutralPlain",
                  },
                })}
              />
            </Box>
          )}
        </List.Item>
      </Dropdown.Item>
    </Box>
  );
};
