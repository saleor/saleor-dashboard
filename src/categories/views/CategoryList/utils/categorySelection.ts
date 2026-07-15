import { type CategoryFragment } from "@dashboard/graphql";

import { collectDescendantIds } from "./categoryTree";

export const getSelectedWithLoadedDescendants = (
  ids: string[],
  getChildren: (parentId: string) => CategoryFragment[],
): string[] => {
  const selectedWithDescendants = new Set(ids);

  ids.forEach(id => {
    collectDescendantIds(id, getChildren).forEach(descendantId => {
      selectedWithDescendants.add(descendantId);
    });
  });

  return Array.from(selectedWithDescendants);
};

export const removeDescendantsFromDeselectedParents = (
  ids: string[],
  previouslySelectedIds: string[],
  getChildren: (parentId: string) => CategoryFragment[],
): string[] => {
  const incomingIds = new Set(ids);
  const descendantsToRemove = new Set(
    previouslySelectedIds
      .filter(selectedId => !incomingIds.has(selectedId))
      .flatMap(selectedId => collectDescendantIds(selectedId, getChildren)),
  );

  return ids.filter(id => !descendantsToRemove.has(id));
};
