import { CircularProgress } from "@material-ui/core";
import { Box, Checkbox, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import messages from "./messages";
import { NewColumnPickerSearch } from "./NewColumnPickerSearch";
import { ColumnCategory } from "./useColumns";

export interface NewColumnPickerAvailableNodesProps {
  currentCategory: ColumnCategory;
  columnPickerSettings: string[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  changeHandler: (column: string) => void;
}

export const NewColumnPickerAvailableNodes = ({
  currentCategory,
  columnPickerSettings,
  query,
  setQuery,
  changeHandler,
}) => {
  const areNodesLoading = currentCategory.availableNodes === undefined;
  const areNodesEmpty = currentCategory.availableNodes?.length === 0;

  const renderNodes = () => {
    switch (true) {
      case areNodesLoading:
        return (
          <Box
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        );
      case areNodesEmpty:
        return (
          <Text size="small" color="textNeutralSubdued">
            <FormattedMessage {...messages.noResultsFound} />
          </Text>
        );
      default:
        return currentCategory.availableNodes.map(node => (
          <Box
            display="flex"
            alignItems="center"
            padding={5}
            gap={6}
            key={node.id}
          >
            <Checkbox
              onCheckedChange={() => changeHandler(node.id)}
              checked={columnPickerSettings.includes(node.id)}
            >
              <Text size="small" color="textNeutralSubdued">
                {node.title}
              </Text>
            </Checkbox>
          </Box>
        ));
    }
  };

  return (
    <>
      <Box display="flex" paddingX={7} style={{ boxSizing: "border-box" }}>
        <NewColumnPickerSearch
          currentCategory={currentCategory}
          query={query}
          setQuery={setQuery}
        />
      </Box>
      <Box paddingX={8} paddingY={4} flexGrow="1">
        {renderNodes()}
      </Box>
    </>
  );
};
