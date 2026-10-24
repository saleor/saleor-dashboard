import { type AttributeReferenceView } from "./attributeReferenceLayout";

export const ATTRIBUTE_REFERENCE_LIST_VIEW_STORAGE_KEY = "attributeReferenceListView";

export type AttributeReferenceListMode = "list" | "packed";

/** One mode per surface and type. A missing key stays on the list. */
export type AttributeReferenceListViewMap = Record<string, AttributeReferenceListMode>;

const slotFor = (view: AttributeReferenceView, typeId: string): string => `${view}:${typeId}`;

export const attributeReferenceListMode = ({
  modes,
  view,
  typeId,
}: {
  modes: AttributeReferenceListViewMap;
  view: AttributeReferenceView;
  typeId?: string;
}): AttributeReferenceListMode => {
  if (!typeId || !modes) {
    return "list";
  }

  return modes[slotFor(view, typeId)] === "packed" ? "packed" : "list";
};

export const withAttributeReferenceListMode = ({
  modes,
  view,
  typeId,
  mode,
}: {
  modes: AttributeReferenceListViewMap;
  view: AttributeReferenceView;
  typeId: string;
  mode: AttributeReferenceListMode;
}): AttributeReferenceListViewMap => ({
  ...(modes ?? {}),
  [slotFor(view, typeId)]: mode,
});
