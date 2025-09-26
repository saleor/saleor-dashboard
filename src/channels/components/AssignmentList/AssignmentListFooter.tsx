import { Combobox } from "@dashboard/components/Combobox";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import CardAddItemsFooter from "@dashboard/products/components/ProductStocks/components/CardAddItemsFooter";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { ClickAwayListener } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
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

const AssignmentListFooter = ({
  items,
  itemsChoices,
  itemsName,
  inputName,
  dataTestId,
  addItem,
  searchItems,
  fetchMoreItems,
}: AssignmentListFooterProps) => {
  const intl = useIntl();
  const [isChoicesSelectShown, setIsChoicesSelectShown] = useState(false);
  const itemsRef = useRef<AssignItem[]>(items);

  // select holds value and displays it so it needs remounting
  // to display empty input after adding new zone
  useEffect(() => {
    if (items.length > itemsRef.current.length) {
      setIsChoicesSelectShown(true);
    }

    itemsRef.current = items;
  }, [items]);

  const handleChoice = ({ target }: ChangeEvent) => {
    if (!target.value) {
      return;
    }

    setIsChoicesSelectShown(false);
    addItem(target.value);
  };
  const handleFooterClickAway = () => {
    setIsChoicesSelectShown(false);
    searchItems("");
  };

  return isChoicesSelectShown ? (
    <ClickAwayListener onClickAway={handleFooterClickAway}>
      <Box marginTop={3}>
        <Combobox
          data-test-id={`${dataTestId}-auto-complete-select`}
          name={inputName}
          onChange={handleChoice}
          fetchOptions={searchItems}
          options={mapNodeToChoice(itemsChoices)}
          fetchMore={fetchMoreItems}
          value={{
            value: "",
            label: "",
          }}
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
