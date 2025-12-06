import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Search, X } from "lucide-react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const SearchHistory = ({
  history,
  onClearHistory,
  onClearItem,
  onItemClick,
}: {
  history: string[];
  onClearHistory: () => void;
  onClearItem: (item: string) => void;
  onItemClick: (item: string) => void;
}) => {
  if (history.length === 0) return null;

  const handleRemoveItem = (event: React.MouseEvent<HTMLButtonElement>, item: string) => {
    event.stopPropagation();
    onClearItem(item);
  };

  return (
    <Box width="100%">
      <Text size={2} fontWeight="medium" color="default2" paddingLeft={6}>
        <FormattedMessage id="UE9zNR" defaultMessage="Recent Searches" />
      </Text>
      <Box
        display="flex"
        width="100%"
        flexWrap="wrap"
        alignItems="flex-start"
        gap={2}
        marginTop={5}
        marginBottom={5}
      >
        {history.map(item => (
          <Box
            key={item}
            width="100%"
            paddingX={6}
            cursor="pointer"
            display="flex"
            alignItems="center"
            paddingY={1}
            onClick={() => onItemClick(item)}
            backgroundColor={{
              default: "default1",
              hover: "default1Hovered",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              fontSize={3}
              width="100%"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Search size={iconSize.small} strokeWidth={iconStrokeWidth} />
                {item}
              </Box>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding={0}
                margin={0}
                borderWidth={0}
                backgroundColor="transparent"
                color={{
                  default: "default1",
                  hover: "default2",
                }}
                cursor="pointer"
                onClick={(evt: React.MouseEvent<HTMLButtonElement>) => handleRemoveItem(evt, item)}
              >
                <X size={iconSize.small} strokeWidth={iconStrokeWidth} />
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={1}
          padding={0}
          margin={0}
          marginTop={1}
          paddingLeft={6}
          borderWidth={0}
          width="100%"
          fontSize={3}
          fontWeight="medium"
          cursor="pointer"
          __height="50px"
          onClick={onClearHistory}
          backgroundColor={{
            default: "default1",
            hover: "default1Hovered",
          }}
        >
          <X size={iconSize.small} strokeWidth={iconStrokeWidth} />
          <FormattedMessage id="zfSKyx" defaultMessage="Clear history" />
        </Box>
      </Box>
    </Box>
  );
};
