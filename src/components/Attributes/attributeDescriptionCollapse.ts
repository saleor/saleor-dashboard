import useLocalStorage from "@dashboard/hooks/useLocalStorage";

export const ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY = "attributeInternalDescriptionCollapsed";

const readCollapsedIds = (): string[] => {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(stored) ? stored.filter(id => typeof id === "string") : [];
  } catch {
    return [];
  }
};

/** Collapsed attribute ids are shared by every product, variant, and model form. */
export const useAttributeDescriptionCollapsed = (
  attributeId: string | undefined,
): { collapsed: boolean; toggle: () => void } => {
  const [collapsedIds, setCollapsedIds] = useLocalStorage<string[]>(
    ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY,
    [],
  );
  const collapsed =
    attributeId !== undefined && Array.isArray(collapsedIds) && collapsedIds.includes(attributeId);

  const toggle = () => {
    if (attributeId === undefined) {
      return;
    }

    // Every row holds its own copy of the list, so merge into what other rows stored since.
    const otherIds = readCollapsedIds().filter(id => id !== attributeId);

    setCollapsedIds(collapsed ? otherIds : [...otherIds, attributeId]);
  };

  return { collapsed, toggle };
};
