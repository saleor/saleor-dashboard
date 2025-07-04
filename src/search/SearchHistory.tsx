import { Box, CloseIcon, SearchIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const SearchHistory = ({
  history,
  onClearHistory,
  onItemClick,
}: {
  history: string[];
  onClearHistory: () => void;
  onItemClick: (item: string) => void;
}) => {
  if (history.length === 0) return null;

  return (
    <Box paddingLeft={6}>
      <Text size={2} fontWeight="medium" color="default2">
        <FormattedMessage id="UE9zNR" defaultMessage="Recent Searches" />
      </Text>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={2}
        marginTop={5}
        marginBottom={5}
      >
        {history.map(item => (
          <Box key={item}>
            <Box
              key={item}
              cursor="pointer"
              display="inline-block"
              onClick={() => onItemClick(item)}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                fontSize={3}
                className="global-search-history-item"
              >
                <SearchIcon size="small" />
                {item}
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
          marginTop={3}
          backgroundColor="transparent"
          borderWidth={0}
          fontSize={3}
          fontWeight="medium"
          cursor="pointer"
          className="global-search-history-clear-button"
          onClick={onClearHistory}
        >
          <CloseIcon size="small" />
          <FormattedMessage id="zfSKyx" defaultMessage="Clear history" />
        </Box>
      </Box>
    </Box>
  );
};
