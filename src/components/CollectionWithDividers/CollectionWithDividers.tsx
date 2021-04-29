import Divider from "@material-ui/core/Divider";
import initial from "lodash-es/initial";
import React from "react";

interface CollectionWithDividersProps<T> {
  renderDivider?: () => React.ReactNode;
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
  renderDivider,
  renderEmpty
}: CollectionWithDividersProps<T>) {
  const hasNoItemsAndPlaceholder = !renderEmpty && !collection.length;

  if (hasNoItemsAndPlaceholder) {
    return null;
  }

  if (!collection.length) {
    return !!renderEmpty ? renderEmpty(collection) : null;
  }

  const defaultRenderDivider = () => <Divider />;

  const renderDividerFunction = renderDivider || defaultRenderDivider;

  return initial(
    collection.reduce(
      (result, item, index) => [
        ...result,
        renderItem(item, index, collection),
        renderDividerFunction()
      ],
      []
    )
  );
}

export default CollectionWithDividers;
