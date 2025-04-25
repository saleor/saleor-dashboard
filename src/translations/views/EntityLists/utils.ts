import { ShippingMethodTranslationsQuery } from "@dashboard/graphql";
import { TranslatableEntity } from "@dashboard/translations/components/TranslationsEntitiesList";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export function mapTranslationsToEntities(
  data: ShippingMethodTranslationsQuery | undefined,
): TranslatableEntity[] {
  if (!data?.translations) {
    return [];
  }

  const items = mapEdgesToItems(data.translations);

  if (!items) {
    return [];
  }

  return items.reduce((acc, node) => {
    if (node.__typename === "ShippingMethodTranslatableContent") {
      acc.push({
        completion: {
          current: sumCompleted([node.translation?.name, node.translation?.description]),
          max: 2,
        },
        id: node?.shippingMethod?.id ?? "",
        name: node?.name,
      });
    }

    return acc;
  }, [] as TranslatableEntity[]);
}

export function sumCompleted(list: any[]): number {
  return list.reduce((acc, field) => acc + (field ? 1 : 0), 0);
}
