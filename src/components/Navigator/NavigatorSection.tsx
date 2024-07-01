import { Box, Text } from "@saleor/macaw-ui-next";
import { GetItemPropsOptions } from "downshift";
import React from "react";

import { QuickSearchAction } from "./types";

interface NavigatorSearchSectionProps {
  getItemProps: (options: GetItemPropsOptions<QuickSearchAction>) => any;
  highlightedIndex: number;
  label: string;
  items: QuickSearchAction[];
  offset: number;
}

const NavigatorSearchSection: React.FC<NavigatorSearchSectionProps> = props => {
  const { getItemProps, highlightedIndex, label, items, offset } = props;

  return (
    <Box marginY={2} overflowY="hidden" __maxHeight="inherit">
      <Text
        paddingLeft={4}
        textTransform="uppercase"
        fontWeight="bodyStrongLarge"
        fontSize="bodyEmpMedium"
      >
        {label}
      </Text>

      {items.map((item, itemIndex) => {
        const index = offset + itemIndex;
        const itemProps = getItemProps({
          index,
          item,
        });

        return (
          <Box
            {...itemProps}
            tabIndex={index}
            role="button"
            variant="secondary"
            width="100%"
            paddingX={4}
            paddingY={2}
            borderRadius={4}
            backgroundColor={{
              hover: "interactiveBrandSecondaryHovering",
              active: "interactiveBrandSecondaryFocused",
            }}
            selected={highlightedIndex === index}
            key={[item.label, item.type].join(":")}
            cursor="pointer"
          >
            <Box as="span" display="inline-block">
              {item.symbol && (
                <Box
                  as="span"
                  display="inline-block"
                  fontWeight="bodyStrongMedium"
                  width={6}
                >
                  {item.symbol}
                </Box>
              )}

              <Text size="medium">{item.label}</Text>

              {item.caption && (
                <Text size="small" marginLeft={2}>
                  {item.caption}
                </Text>
              )}
            </Box>

            <Box __flex={1} />

            {item.extraInfo}
          </Box>
        );
      })}
    </Box>
  );
};

NavigatorSearchSection.displayName = "NavigatorSection";
export default NavigatorSearchSection;
