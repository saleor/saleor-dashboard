import { CircularProgress } from "@material-ui/core";
import {
  Box,
  Button,
  Checkbox,
  List,
  SearchInput,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";
import { ColumnCategory } from "./useColumns";
import { getExitIcon, getExitOnClick } from "./utils";

export interface NewColumnPickerCategoriesProps {
  columnCategories: ColumnCategory[];
  columnPickerSettings: string[];
  onClose: () => void;
  onDynamicColumnSelect: (columns: string[]) => void;
}

export const NewColumnPickerCategories: React.FC<
  NewColumnPickerCategoriesProps
> = ({
  columnCategories,
  onClose,
  onDynamicColumnSelect,
  columnPickerSettings,
}) => {
  const intl = useIntl();

  const [selectedCategory, setSelectedCategory] = React.useState<string>();

  const currentCategory = React.useMemo(
    () => columnCategories.find(category => category.name === selectedCategory),
    [columnCategories, selectedCategory],
  );

  const changeHandler = (column: string) => {
    if (columnPickerSettings.includes(column)) {
      onDynamicColumnSelect(
        columnPickerSettings.filter(currentCol => currentCol !== column),
      );
    } else {
      onDynamicColumnSelect([...columnPickerSettings, column]);
    }
  };

  React.useEffect(() => {
    // Preselect category when there is only one
    if (columnCategories.length === 1) {
      setSelectedCategory(columnCategories[0].name);
    }
  }, [columnCategories]);

  return (
    <Box backgroundColor="subdued">
      <Box display="flex" paddingX={7} paddingY={5} gap={5} alignItems="center">
        <Button
          variant="tertiary"
          size="small"
          icon={getExitIcon(columnCategories, selectedCategory)}
          onClick={getExitOnClick({
            columnCategories,
            selectedCategory,
            setSelectedCategory,
            onClose,
          })}
        />
        <Text size="small">
          {selectedCategory ?? <FormattedMessage {...messages.categories} />}
        </Text>
      </Box>
      {selectedCategory ? (
        <>
          <Box paddingX={7} style={{ boxSizing: "border-box" }}>
            <SearchInput
              size="small"
              placeholder={intl.formatMessage(messages.searchForColumns)}
              onChange={e => currentCategory.onSearch(e.target.value ?? "")}
            />
          </Box>
          <Box padding={8}>
            {currentCategory.availableNodes === undefined ? (
              <CircularProgress />
            ) : (
              <>
                {currentCategory.availableNodes.map(node => (
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
                ))}

                {/* TODO: Pagination */}
              </>
            )}
          </Box>
        </>
      ) : (
        <List padding={8}>
          {columnCategories.map(category => (
            <List.Item
              key={category.prefix}
              padding={4}
              borderRadius={3}
              onClick={() => setSelectedCategory(category.name)}
            >
              <Text size="small">{category.name}</Text>
            </List.Item>
          ))}
        </List>
      )}
    </Box>
  );
};
