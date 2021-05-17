import uniq from "lodash/uniq";

export const getUpdatedIdsWithNewId = (ids: string[], newId: string) =>
  uniq([...ids, newId]);

export const getUpdatedIdsWithoutNewId = (ids: string[], newId: string) =>
  ids.filter(id => id !== newId);
