import { uniq } from "lodash-es";

export const getUpdatedIdsWithNewId = (ids: string[], newId: string) =>
  uniq([...ids, newId]);
