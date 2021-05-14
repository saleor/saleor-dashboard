import { Divider } from "@material-ui/core";
import initial from "lodash/initial";
import React from "react";

interface CollectionWithDividersProps<T> {
  DividerComponent?: React.FunctionComponent;
  renderEmpty?: (collection: T[]) => any;
  collection: T[];
  renderItem: (
    item: T | undefined,
    index: number | undefined,
    collection: T[]
  ) => any;
}

function CollectionWithDividers<T>({
  collection,
  renderItem,
  DividerComponent,
  renderEmpty
}: CollectionWithDividersProps<T>) {
  const hasNoItemsAndPlaceholder = !renderEmpty && !collection.length;

  if (hasNoItemsAndPlaceholder) {
    return null;
  }

  if (!collection.length) {
    return !!renderEmpty ? renderEmpty(collection) : null;
  }

  const SelectedDividerComponent = DividerComponent || Divider;

  return initial(
    collection.reduce(
      (result, item, index) => [
        ...result,
        renderItem(item, index, collection),
        <SelectedDividerComponent />
      ],
      []
    )
  );
}

export default CollectionWithDividers;
