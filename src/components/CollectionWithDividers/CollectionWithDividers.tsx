import { Divider } from "@material-ui/core";
import React from "react";

interface CollectionWithDividersProps<T> {
  DividerComponent?: React.FunctionComponent;
  renderEmpty?: (collection: T[]) => any;
  withOuterDividers?: boolean;
  collection: T[];
  renderItem: (
    item: T | undefined,
    index: number | undefined,
    collection: T[],
  ) => any;
}

const Wrapper: React.FC<{
  withOuterDividers?: boolean;
  SelectedDivider?: React.FunctionComponent;
}> = ({ withOuterDividers, SelectedDivider, children }) => (
  <div>
    {withOuterDividers && SelectedDivider ? (
      <>
        <SelectedDivider />
        {children}
        <SelectedDivider />
      </>
    ) : (
      <>{children}</>
    )}
  </div>
);

function CollectionWithDividers<T>({
  withOuterDividers = false,
  collection,
  renderItem,
  DividerComponent,
  renderEmpty,
}: CollectionWithDividersProps<T>) {
  const hasNoItemsAndPlaceholder = !renderEmpty && !collection.length;

  if (hasNoItemsAndPlaceholder) {
    return null;
  }

  if (!collection.length) {
    return !!renderEmpty ? renderEmpty(collection) : null;
  }

  const SelectedDividerComponent = DividerComponent || Divider;

  return (
    <Wrapper
      withOuterDividers={withOuterDividers}
      SelectedDivider={SelectedDividerComponent}
    >
      <>
        {collection.map((item, index) => (
          <>
            {renderItem(item, index, collection)}
            <SelectedDividerComponent />
          </>
        ))}
      </>
    </Wrapper>
  );
}

export default CollectionWithDividers;
