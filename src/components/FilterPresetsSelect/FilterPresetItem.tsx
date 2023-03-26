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
    <Dropdown.Item>
      <Box
        position="relative"
        onMouseOver={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
      >
        <>
          <List.Item
            paddingLeft={4}
            paddingRight={11}
            paddingY={3}
            gap={6}
            borderRadius={2}
            display="flex"
            justifyContent="space-between"
            onClick={onSelect}
          >
            <Text variant={isActive ? "bodyStrong" : "body"}>{children}</Text>
          </List.Item>
          {hasHover && (
            <Box
              cursor="pointer"
              zIndex="2"
              position="absolute"
              __top="50%"
              __right="6px"
              __transform="translateY(-50%)"
              onClick={onRemove}
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
        </>
      </Box>
    </Dropdown.Item>
  );
};
