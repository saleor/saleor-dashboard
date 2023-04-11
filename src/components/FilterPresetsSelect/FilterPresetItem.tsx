import { Box, Dropdown, List, RemoveIcon, Text } from "@saleor/macaw-ui/next";
import React, { MouseEvent } from "react";

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
        paddingLeft={4}
        paddingRight={11}
        paddingY={3}
        gap={6}
        borderRadius={2}
        position="relative"
        display="flex"
        justifyContent="space-between"
        onClick={onSelect}
        onMouseOver={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
      >
        <Text ellipsis variant={isActive ? "bodyStrong" : "body"}>
          {children}
        </Text>
        {hasHover && (
          <Box
            cursor="pointer"
            zIndex="2"
            position="absolute"
            __top="50%"
            right={4}
            __transform="translateY(-50%)"
            onClick={onRemove}
            display="flex"
            alignItems="center"
          >
            <RemoveIcon
              color={{
                default: "iconNeutralSubdued",
                hover: "iconNeutralPlain",
                focusVisible: "iconNeutralPlain",
              }}
            />
          </Box>
        )}
      </List.Item>
    </Dropdown.Item>
  );
};
