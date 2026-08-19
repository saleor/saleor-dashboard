export interface CategorySaveComposition {
  hasGeneral: boolean;
}

const GENERAL_FIELD_KEYS = [
  "name",
  "slug",
  "seoTitle",
  "seoDescription",
  "backgroundImageAlt",
] as const;

export const buildCategorySaveComposition = (
  changedFieldNames: ReadonlyArray<string>,
  descriptionDirty: boolean,
): CategorySaveComposition => ({
  hasGeneral:
    descriptionDirty || GENERAL_FIELD_KEYS.some(field => changedFieldNames.includes(field)),
});

export const hasCategorySaveComposition = (composition: CategorySaveComposition): boolean =>
  composition.hasGeneral;

export const EMPTY_CATEGORY_SAVE_COMPOSITION: CategorySaveComposition = {
  hasGeneral: false,
};
