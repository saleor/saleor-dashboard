import { type ProductTypeBaseData } from "@dashboard/components/TypeDeleteWarningDialog/useViewProducts";

export const resolveProductTypesForViewLink = (
  typeIds: string[],
  typeBaseData?: ProductTypeBaseData[],
): ProductTypeBaseData[] | undefined => {
  if (!typeIds.length || !typeBaseData?.length) {
    return undefined;
  }

  const matched = typeBaseData.filter(type => typeIds.includes(type.id));

  if (matched.length > 0) {
    return matched;
  }

  if (typeIds.length === 1 && typeBaseData.length === 1) {
    return typeBaseData;
  }

  return undefined;
};
