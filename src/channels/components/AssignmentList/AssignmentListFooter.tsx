import { ClickAwayListener } from "@material-ui/core";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import CardAddItemsFooter from "@saleor/products/components/ProductStocks/CardAddItemsFooter";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React, { useEffect, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { useStyles } from "./styles";
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
  const classes = useStyles();

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

  const handleChoice = ({ target }) => {
    setIsChoicesSelectShown(false);
    addItem(target.value);
  };

  const handleFooterClickAway = () => {
    setIsChoicesSelectShown(false);
    searchItems("");
  };

  return isChoicesSelectShown ? (
    <ClickAwayListener onClickAway={handleFooterClickAway}>
      <div className={classes.root}>
        <SingleAutocompleteSelectField
          data-test-id={`${dataTestId}-auto-complete-select`}
          value=""
          displayValue=""
          nakedInput
          name={inputName}
          choices={mapNodeToChoice(itemsChoices)}
          fetchChoices={searchItems}
          onChange={handleChoice}
          {...fetchMoreItems}
        />
      </div>
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
