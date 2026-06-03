import useDebounce from "@dashboard/hooks/useDebounce";
import { commonMessages } from "@dashboard/intl";
import CardAddItemsFooter from "@dashboard/products/components/ProductStocks/components/CardAddItemsFooter";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { ClickAwayListener } from "@material-ui/core";
import { Box, DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { AssignItem, AssignmentListProps } from "./types";

const messages = defineMessages({
  addItemTitle: {
    id: "EuOXmr",
    defaultMessage: "Add {itemsName}",
    description: "add items title",
  },
});

type AssignmentListFooterProps = AssignmentListProps;

const AssignmentListFooter: React.FC<AssignmentListFooterProps> = ({
  items,
  itemsChoices,
  itemsName,
  inputName,
  dataTestId,
  addItem,
  searchItems,
  fetchMoreItems,
}) => {
  const intl = useIntl();
  const [isChoicesSelectShown, setIsChoicesSelectShown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const itemsRef = useRef<AssignItem[]>(items);
  const debouncedSearch = useDebounce(searchItems, 500);

  // select holds value and displays it so it needs remounting
  // to display empty input after adding new zone
  useEffect(() => {
    if (items.length > itemsRef.current.length) {
      setIsChoicesSelectShown(true);
    }

    itemsRef.current = items;
  }, [items]);

  const handleChoice = (option: Option | null) => {
    if (!option?.value) {
      return;
    }

    setIsChoicesSelectShown(false);
    setSelectedOption(null);
    addItem(option.value);
  };
  const handleFooterClickAway = () => {
    setIsChoicesSelectShown(false);
    setSelectedOption(null);
    searchItems("");
  };

  return isChoicesSelectShown ? (
    <ClickAwayListener onClickAway={handleFooterClickAway}>
      <Box marginTop={3}>
        <DynamicCombobox
          data-test-id={`${dataTestId}-auto-complete-select`}
          name={inputName}
          onChange={handleChoice}
          onInputValueChange={debouncedSearch}
          onFocus={() => searchItems("")}
          options={mapNodeToChoice(itemsChoices)}
          onScrollEnd={() => {
            if (fetchMoreItems?.hasMore) {
              fetchMoreItems.onFetchMore();
            }
          }}
          loading={fetchMoreItems?.loading || fetchMoreItems?.hasMore}
          value={selectedOption}
          locale={{
            loadingText: intl.formatMessage(commonMessages.loading),
          }}
          size="small"
        />
      </Box>
    </ClickAwayListener>
  ) : (
    <CardAddItemsFooter
      onAdd={() => setIsChoicesSelectShown(true)}
      title={intl.formatMessage(messages.addItemTitle, {
        itemsName,
      })}
      testIds={{
        link: `${dataTestId}-add-link`,
        button: `${dataTestId}-add-button`,
      }}
    />
  );
};

export default AssignmentListFooter;
