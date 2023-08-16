import { Name } from "@dashboard/featureFlags/availableFlags";
import { useFlagsInfo } from "@dashboard/featureFlags/useFlagsInfo";
import { List, Text } from "@saleor/macaw-ui/next";
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
      borderColor="neutralHighlight"
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
              default:
                selectedName === flag.name
                  ? "surfaceNeutralHighlight"
                  : "surfaceNeutralSubdued",
              hover: "surfaceNeutralHighlight",
            }}
            borderColor="neutralHighlight"
            borderBottomWidth={1}
            borderBottomStyle="solid"
            onClick={() => onItemClick(flag.name)}
          >
            <Text variant="body">{flag.displayName}</Text>
          </List.Item>
        ))}
    </List>
  );
};
