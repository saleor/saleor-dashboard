import {
  type ProductTranslationFragment,
  type ShippingMethodTranslationsQuery,
} from "@dashboard/graphql";
import { type TranslatableEntity } from "@dashboard/translations/components/TranslationsEntitiesList";
import {
  getTranslationCompletion,
  type TranslationProgress,
} from "@dashboard/translations/progress";
import { TranslationFieldType } from "@dashboard/translations/types";
import { isAttributeValueTranslationComplete } from "@dashboard/translations/utils";
import { mapEdgesToItems } from "@dashboard/utils/maps";

interface ListCompletion {
  current: number;
  max: number;
}

interface GeneralTranslationFields {
  description?: string | null;
  name?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  slug?: string | null;
}

interface PageTranslationFields {
  content?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  slug?: string | null;
  title?: string | null;
}

interface NameDescriptionTranslationFields {
  description?: string | null;
  name?: string | null;
}

function toListCompletion({ completed, total }: TranslationProgress): ListCompletion {
  return { current: completed, max: total };
}

export function getGeneralEntityTranslationCompletion(
  translation: GeneralTranslationFields | null | undefined,
): ListCompletion {
  return toListCompletion(
    getTranslationCompletion([
      { translation: translation?.name, type: TranslationFieldType.SHORT },
      { translation: translation?.description, type: TranslationFieldType.RICH },
      { translation: translation?.slug, type: TranslationFieldType.SHORT },
      { translation: translation?.seoTitle, type: TranslationFieldType.SHORT },
      { translation: translation?.seoDescription, type: TranslationFieldType.LONG },
    ]),
  );
}

export function getPageTranslationCompletion(
  translation: PageTranslationFields | null | undefined,
): ListCompletion {
  return toListCompletion(
    getTranslationCompletion([
      { translation: translation?.title, type: TranslationFieldType.SHORT },
      { translation: translation?.content, type: TranslationFieldType.RICH },
      { translation: translation?.slug, type: TranslationFieldType.SHORT },
      { translation: translation?.seoTitle, type: TranslationFieldType.SHORT },
      { translation: translation?.seoDescription, type: TranslationFieldType.LONG },
    ]),
  );
}

export function getNameDescriptionTranslationCompletion(
  translation: NameDescriptionTranslationFields | null | undefined,
): ListCompletion {
  return toListCompletion(
    getTranslationCompletion([
      { translation: translation?.name, type: TranslationFieldType.SHORT },
      { translation: translation?.description, type: TranslationFieldType.RICH },
    ]),
  );
}

export function getSingleNameTranslationCompletion(
  translation: string | null | undefined,
): ListCompletion {
  return toListCompletion(
    getTranslationCompletion([{ translation, type: TranslationFieldType.SHORT }]),
  );
}

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
      const shippingMethodId = node.shippingMethodId ?? node.shippingMethod?.id;

      if (!shippingMethodId) {
        return acc;
      }

      acc.push({
        completion: getNameDescriptionTranslationCompletion(node.translation),
        id: shippingMethodId,
        name: node?.name,
      });
    }

    return acc;
  }, [] as TranslatableEntity[]);
}

export function getProductTranslationCompletion({
  translation,
  attributeValues,
}: Pick<ProductTranslationFragment, "translation" | "attributeValues">) {
  const generalCompletion = getGeneralEntityTranslationCompletion(translation);
  const attributeCompleted =
    attributeValues?.filter(isAttributeValueTranslationComplete).length ?? 0;

  return {
    current: generalCompletion.current + attributeCompleted,
    max: generalCompletion.max + (attributeValues?.length ?? 0),
  };
}
