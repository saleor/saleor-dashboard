interface AttributeId {
  id: string;
}

export const countUniqueAttributeIds = (
  attributeLists: Array<Array<AttributeId> | null | undefined>,
): number => {
  const ids = new Set<string>();

  attributeLists.forEach(attributeList => {
    attributeList?.forEach(attribute => ids.add(attribute.id));
  });

  return ids.size;
};
