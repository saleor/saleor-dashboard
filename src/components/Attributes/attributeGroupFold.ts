import { type AttributeReferenceView } from "./attributeReferenceLayout";

export const ATTRIBUTE_GROUP_FOLD_STORAGE_KEY = "attributeReferenceGroupFold";

/** `true` means the user left that attribute group open. Missing keys stay collapsed. */
export type AttributeGroupFoldMap = Record<string, Record<string, boolean>>;

const attributeGroupFoldSlot = (view: AttributeReferenceView, typeId: string): string =>
  `${view}:${typeId}`;

export const isAttributeGroupExpanded = ({
  folds,
  view,
  typeId,
  attributeId,
}: {
  folds: AttributeGroupFoldMap;
  view: AttributeReferenceView;
  typeId?: string;
  attributeId: string;
}): boolean => {
  if (!typeId || !folds) {
    return false;
  }

  return folds[attributeGroupFoldSlot(view, typeId)]?.[attributeId] === true;
};

export const withAttributeGroupExpanded = ({
  folds,
  view,
  typeId,
  attributeId,
  expanded,
}: {
  folds: AttributeGroupFoldMap;
  view: AttributeReferenceView;
  typeId: string;
  attributeId: string;
  expanded: boolean;
}): AttributeGroupFoldMap => {
  const slot = attributeGroupFoldSlot(view, typeId);
  const current = folds ?? {};

  return {
    ...current,
    [slot]: {
      ...current[slot],
      [attributeId]: expanded,
    },
  };
};
