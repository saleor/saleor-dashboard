import useLocalStorage from "./useLocalStorage";

export type LastCreatedEntityType = "MODEL";

const storageKey = (entityType: LastCreatedEntityType) => `lastCreatedEntityType:${entityType}`;

export const useLastCreatedEntityTypeStorage = (entityType: LastCreatedEntityType) => {
  const [value, setValue] = useLocalStorage<string | null>(storageKey(entityType), null);

  return [value, setValue] as const;
};
