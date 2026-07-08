import { type AssignedTypeList } from "@dashboard/attributes/utils/mapAssignedTypeConnection";

export type AssignedTypeRole = "product" | "variant";

export interface MergedAssignedType {
  id: string;
  name: string;
  roles: AssignedTypeRole[];
}

export interface ProductAssignedTypeUsage {
  types: MergedAssignedType[];
  productTypeCount: number;
  variantTypeCount: number;
  hasMore: boolean;
}

export const mergeProductAssignedTypeUsage = (
  productTypes?: AssignedTypeList,
  variantTypes?: AssignedTypeList,
): ProductAssignedTypeUsage => {
  const byId = new Map<string, MergedAssignedType>();

  productTypes?.items.forEach(type => {
    byId.set(type.id, {
      id: type.id,
      name: type.name,
      roles: ["product"],
    });
  });

  variantTypes?.items.forEach(type => {
    const existing = byId.get(type.id);

    if (existing) {
      if (!existing.roles.includes("variant")) {
        existing.roles.push("variant");
      }

      return;
    }

    byId.set(type.id, {
      id: type.id,
      name: type.name,
      roles: ["variant"],
    });
  });

  const types = Array.from(byId.values()).sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  return {
    types,
    productTypeCount: productTypes?.items.length ?? 0,
    variantTypeCount: variantTypes?.items.length ?? 0,
    hasMore: !!(productTypes?.hasMore || variantTypes?.hasMore),
  };
};
