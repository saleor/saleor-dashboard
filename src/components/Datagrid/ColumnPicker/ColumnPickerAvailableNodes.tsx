import { SaleorThrobber } from "@dashboard/components/Throbber";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ColumnPickerSearch } from "./ColumnPickerSearch";
import messages from "./messages";
import { ColumnCategory } from "./useColumns";

interface ColumnPickerAvailableNodesProps {
  currentCategory: ColumnCategory;
  selectedColumns: string[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onToggle: (column: string) => void;
}

export const ColumnPickerAvailableNodes = ({
  currentCategory,
  selectedColumns,
  query,
  setQuery,
  onToggle,
}: ColumnPickerAvailableNodesProps) => {
  const areNodesLoading = currentCategory.availableNodes === undefined;
  const areNodesEmpty = currentCategory.availableNodes?.length === 0;
  const renderNodes = () => {
    if (areNodesLoading) {
      return (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          <SaleorThrobber />
        </Box>
      );
    }

    if (areNodesEmpty) {
      return (
        <Text size={3} color="default2">
          <FormattedMessage {...messages.noResultsFound} />
        </Text>
      );
    }

    return currentCategory.availableNodes!.map(node => (
      <Box padding={2} key={node.id}>
        <Checkbox
          onCheckedChange={() => onToggle(node.id)}
          checked={selectedColumns.includes(node.id)}
          data-test-id={`dynamic-column`}
        >
          <Text
            data-test-id={`dynamic-column-name-${node.title}`}
            size={3}
            color="default2"
            ellipsis
          >
            {node.pickerTitle ?? node.title}
          </Text>
        </Checkbox>
      </Box>
    ));
  };

  return (
    <>
      <Box
        display="flex"
        paddingX={4}
        style={{ boxSizing: "border-box" }}
        data-test-id="search-container"
      >
        <ColumnPickerSearch currentCategory={currentCategory} query={query} setQuery={setQuery} />
      </Box>
      <Box paddingX={5} paddingY={1.5} flexGrow="1">
        {renderNodes()}
      </Box>
    </>
  );
};
