import { Name } from "@dashboard/featureFlags/availableFlags";
import { useFlagsInfo } from "@dashboard/featureFlags/useFlagsInfo";
import { List, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface FlagListProps {
  selectedName: string;
  onItemClick: (name: Name) => void;
}

export const FlagList = ({ selectedName, onItemClick }: FlagListProps) => {
  const flags = useFlagsInfo();

  return (
    <List
      __width="40%"
      borderWidth={1}
      borderStyle="solid"
      borderBottomWidth={0}
      borderColor="default1"
      overflowY="scroll"
    >
      {flags
        .filter(flag => flag.visible)
        .map(flag => (
          <List.Item
            key={flag.name}
            paddingX={3}
            paddingY={4}
            backgroundColor={{
              default: selectedName === flag.name ? "default3" : "default1",
              hover: selectedName !== flag.name ? "default2" : undefined,
            }}
            borderColor="default1"
            borderBottomWidth={1}
            borderBottomStyle="solid"
            onClick={() => onItemClick(flag.name)}
          >
            <Text fontWeight={selectedName === flag.name ? "bold" : "regular"}>
              {flag.displayName}
            </Text>
          </List.Item>
        ))}
    </List>
  );
};
