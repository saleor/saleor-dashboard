import { Box, Text } from "@saleor/macaw-ui-next";
import { GetItemPropsOptions } from "downshift";

import { QuickSearchAction } from "./types";

interface NavigatorSearchSectionProps {
  getItemProps: (options: GetItemPropsOptions<QuickSearchAction>) => any;
  highlightedIndex: number;
  label: string;
  items: QuickSearchAction[];
  offset: number;
}

const NavigatorSearchSection = (props: NavigatorSearchSectionProps) => {
  const { getItemProps, highlightedIndex, label, items, offset } = props;

  return (
    <Box marginY={2} overflowY="hidden" __maxHeight="inherit">
      <Text paddingLeft={4} textTransform="uppercase" fontWeight="medium" fontSize={4}>
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
              hover: "accent1Hovered",
              active: "accent1Pressed",
            }}
            selected={highlightedIndex === index}
            key={[item.label, item.type].join(":")}
            cursor="pointer"
          >
            <Box as="span" display="inline-block">
              {item.symbol && (
                <Box as="span" display="inline-block" fontWeight="bold" width={6}>
                  {item.symbol}
                </Box>
              )}

              <Text size={3}>{item.label}</Text>

              {item.caption && (
                <Text size={2} marginLeft={2} color="default2">
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

NavigatorSearchSection.displayName = "NavigatorSearchSection";
export default NavigatorSearchSection;
