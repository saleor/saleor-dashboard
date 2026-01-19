import { FetchResult } from "@apollo/client";
import { AttributeInput, AttributeInputData } from "@dashboard/components/Attributes";
import {
  AttributeEntityTypeEnum,
  AttributeErrorFragment,
  AttributeInputTypeEnum,
  AttributeValueDeleteMutation,
  AttributeValueFragment,
  AttributeValueInput,
  FileUploadMutation,
  PageSelectedAttributeFragment,
  ProductFragment,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SelectedVariantAttributeFragment,
  UploadErrorFragment,
} from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";
import { AttributeValuesMetadata } from "@dashboard/products/utils/data";
import { Container, RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { RichTextContextValues } from "@dashboard/utils/richText/context";
import { GetRichTextValues, RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";

import { AttributePageFormData } from "../components/AttributePage";
import { productVariantCacheManager } from "./productVariantCache";

type AtributesOfFiles = Pick<AttributeValueInput, "file" | "id" | "values" | "contentType">;

export interface RichTextProps {
  richText: RichTextContextValues;
  attributeRichTextGetters: RichTextGetters<string>;
}

export const ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES = [
  AttributeInputTypeEnum.DROPDOWN,
  AttributeInputTypeEnum.MULTISELECT,
  AttributeInputTypeEnum.SWATCH,
];

export const ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION = [
  AttributeInputTypeEnum.DROPDOWN,
  AttributeInputTypeEnum.MULTISELECT,
  AttributeInputTypeEnum.BOOLEAN,
  AttributeInputTypeEnum.DATE,
  AttributeInputTypeEnum.DATE_TIME,
  AttributeInputTypeEnum.NUMERIC,
  AttributeInputTypeEnum.SWATCH,
];

export const REFERENCE_ATTRIBUTE_TYPES = [
  AttributeInputTypeEnum.REFERENCE,
  AttributeInputTypeEnum.SINGLE_REFERENCE,
];

export const ENTITY_TYPES_WITH_TYPES_RESTRICTION = [
  AttributeEntityTypeEnum.PRODUCT,
  AttributeEntityTypeEnum.PRODUCT_VARIANT,
  AttributeEntityTypeEnum.PAGE,
];

export interface AttributeReference {
  label: string;
  value: string;
}

export interface AttributeValueEditDialogFormData {
  name: string;
  value?: string;
  fileUrl?: string;
  contentType?: string;
}

export function attributeValueFragmentToFormData(
  data: AttributeValueFragment | null,
): AttributeValueEditDialogFormData {
  return {
    name: data?.name ?? "",
    value: data?.value ?? "",
    contentType: data?.file?.contentType ?? "",
    fileUrl: data?.file?.url,
  };
}

function getSimpleAttributeData(
  data: AttributePageFormData,
  values: AttributeValueEditDialogFormData[],
) {
  return {
    ...data,
    metadata: undefined,
    privateMetadata: undefined,
    storefrontSearchPosition: parseInt(data.storefrontSearchPosition, 10),
    values: values.map(value => ({
      name: value.name,
    })),
  };
}

function getAttributeValueTypeFields({
  fileUrl,
  value,
  name,
  contentType,
}: AttributeValueEditDialogFormData) {
  return {
    name,
    ...(fileUrl ? { fileUrl, contentType } : { value }),
  };
}

function getSwatchAttributeData(
  data: AttributePageFormData,
  values: AttributeValueEditDialogFormData[],
) {
  return {
    ...data,
    metadata: undefined,
    privateMetadata: undefined,
    storefrontSearchPosition: parseInt(data.storefrontSearchPosition, 10),
    values: values.map(getAttributeValueTypeFields),
  };
}

function getFileOrReferenceAttributeData(
  data: AttributePageFormData,
  values: AttributeValueEditDialogFormData[],
) {
  return {
    ...getSimpleAttributeData(data, values),
    values: [],
    availableInGrid: undefined,
    filterableInDashboard: undefined,
    filterableInStorefront: undefined,
    referenceTypes: data.referenceTypes?.map(ref => ref.value) ?? [],
  };
}

export function getAttributeData(
  data: AttributePageFormData,
  values: AttributeValueEditDialogFormData[],
) {
  if (data.inputType === AttributeInputTypeEnum.SWATCH) {
    return getSwatchAttributeData(data, values);
  } else if (ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES.includes(data.inputType)) {
    return getSimpleAttributeData(data, values);
  } else {
    return getFileOrReferenceAttributeData(data, values);
  }
}

function getFirstValueAsArray<T, K extends keyof T>(values: T[], propertyName: K): Array<T[K]> {
  const value = values[0]?.[propertyName];

  return value !== undefined && value !== null ? [value] : [];
}

export function getSelectedAttributeValues(
  attribute:
    | PageSelectedAttributeFragment
    | ProductFragment["attributes"][0]
    | SelectedVariantAttributeFragment,
) {
  switch (attribute.attribute.inputType) {
    case AttributeInputTypeEnum.REFERENCE:
      return attribute.values.map(value => value.reference);
    case AttributeInputTypeEnum.SINGLE_REFERENCE:
      return getFirstValueAsArray(attribute.values, "reference");

    case AttributeInputTypeEnum.PLAIN_TEXT:
      return getFirstValueAsArray(attribute.values, "plainText");

    case AttributeInputTypeEnum.RICH_TEXT:
      return getFirstValueAsArray(attribute.values, "richText");

    case AttributeInputTypeEnum.NUMERIC:
      return getFirstValueAsArray(attribute.values, "name");

    case AttributeInputTypeEnum.BOOLEAN:
      return getFirstValueAsArray(attribute.values, "boolean");

    case AttributeInputTypeEnum.DATE:
      return getFirstValueAsArray(attribute.values, "date");

    case AttributeInputTypeEnum.DATE_TIME:
      return getFirstValueAsArray(attribute.values, "dateTime");

    default:
      return attribute.values.map(value => value.slug);
  }
}

export const isFileValueUnused = (
  attributesWithNewFileValue: FormsetData<null, File>,
  existingAttribute:
    | PageSelectedAttributeFragment
    | ProductFragment["attributes"][0]
    | SelectedVariantAttributeFragment,
) => {
  if (existingAttribute.attribute.inputType !== AttributeInputTypeEnum.FILE) {
    return false;
  }

  if (existingAttribute.values.length === 0) {
    return false;
  }

  const modifiedAttribute = attributesWithNewFileValue.find(
    dataAttribute => dataAttribute.id === existingAttribute.attribute.id,
  );

  return !!modifiedAttribute;
};

export const mergeFileUploadErrors = (
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
): UploadErrorFragment[] =>
  uploadFilesResult.reduce((errors, uploadFileResult) => {
    const uploadErrors = uploadFileResult?.data?.fileUpload?.errors;

    if (uploadErrors) {
      return [...errors, ...uploadErrors];
    }

    return errors;
  }, [] as UploadErrorFragment[]);

export const mergeAttributeValueDeleteErrors = (
  deleteAttributeValuesResult: Array<FetchResult<AttributeValueDeleteMutation>>,
): AttributeErrorFragment[] =>
  deleteAttributeValuesResult.reduce((errors, deleteValueResult) => {
    const deleteErrors = deleteValueResult?.data?.attributeValueDelete?.errors;

    if (deleteErrors) {
      return [...errors, ...deleteErrors];
    }

    return errors;
  }, [] as AttributeErrorFragment[]);

export const mergeChoicesWithValues = (
  attribute:
    | ProductFragment["attributes"][0]
    | PageSelectedAttributeFragment
    | SelectedVariantAttributeFragment,
) => {
  const choices = mapEdgesToItems(attribute.attribute.choices) || [];
  const valuesToConcat = attribute.values.filter(
    value => !choices.some(choice => choice.id === value.id),
  );

  return choices.concat(valuesToConcat);
};

export const mergeAttributeValues = (
  attributeId: string,
  attributeValues: string[],
  attributes: FormsetData<AttributeInputData, string[]>,
) => {
  const attribute = attributes.find(attribute => attribute.id === attributeId);

  return attribute?.value ? [...attribute.value, ...attributeValues] : attributeValues;
};

export const mergeAttributes = (...attributeLists: AttributeInput[][]): AttributeInput[] =>
  attributeLists.reduce((prev, attributes) => {
    const newAttributeIds = new Set(attributes.map(attr => attr.id));

    return [...prev.filter(attr => !newAttributeIds.has(attr.id)), ...attributes];
  }, []);

/**
 * Handles reference attribute assignment for Container-based data
 * Used by ProductCreatePage, ProductVariantPage, and PageDetailsPage
 */
export function handleContainerReferenceAssignment(
  assignReferencesAttributeId: string,
  attributeValues: Container[],
  attributes: AttributeInput[],
  handlers: {
    selectAttributeReference: (id: string, values: string[]) => void;
    selectAttributeReferenceAdditionalData: (
      id: string,
      metadata: Array<{ value: string; label: string }>,
    ) => void;
  },
): void {
  const attribute = attributes.find(({ id }) => id === assignReferencesAttributeId);
  const isSingle = attribute?.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  if (isSingle) {
    const firstValue = attributeValues[0];
    const selectedId = firstValue?.id ?? "";
    const selectedLabel = firstValue?.name ?? "";

    handlers.selectAttributeReference(assignReferencesAttributeId, selectedId ? [selectedId] : []);
    handlers.selectAttributeReferenceAdditionalData(
      assignReferencesAttributeId,
      firstValue ? [{ value: selectedId, label: selectedLabel }] : [],
    );
  } else {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues.map(({ id }) => id),
        attributes as FormsetData<AttributeInputData, string[]>,
      ),
    );
    handlers.selectAttributeReferenceAdditionalData(
      assignReferencesAttributeId,
      attributeValues.map(({ id, name }) => ({ value: id, label: name })),
    );
  }
}

/**
 * Handles reference attribute assignment for AttributeValuesMetadata-based data
 */
export function handleMetadataReferenceAssignment(
  assignReferencesAttributeId: string,
  attributeValues: AttributeValuesMetadata[],
  attributes: AttributeInput[],
  handlers: {
    selectAttributeReference: (id: string, values: string[]) => void;
    selectAttributeReferenceAdditionalData: (
      id: string,
      metadata: AttributeValuesMetadata[],
    ) => void;
  },
): void {
  const attribute = attributes.find(({ id }) => id === assignReferencesAttributeId);
  const isSingle = attribute?.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  if (isSingle) {
    const firstValue = attributeValues[0];
    const selectedValue = firstValue?.value ?? "";

    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      selectedValue ? [selectedValue] : [],
    );
    handlers.selectAttributeReferenceAdditionalData(
      assignReferencesAttributeId,
      firstValue ? [firstValue] : [],
    );
  } else {
    const finalValues = mergeAttributeValues(
      assignReferencesAttributeId,
      attributeValues.map(({ value }) => value),
      attributes as FormsetData<AttributeInputData, string[]>,
    );

    /* We will store attribute selection display values in useFormset "additionalData" field
     * This has to be done, because when user chooses new references in the modal,
     * we don't yet have referenced item details from the query */
    const existingMetadata = attribute?.additionalData || [];
    const newMetadata = attributeValues;
    const allMetadata = [...existingMetadata, ...newMetadata];

    // Remove duplicate entries, happens when user deletes and adds value before saving the form
    const uniqueMetadata = allMetadata.reduce((acc, meta) => {
      if (finalValues.includes(meta.value) && !acc.find(m => m.value === meta.value)) {
        acc.push(meta);
      }

      return acc;
    }, [] as AttributeValuesMetadata[]);

    handlers.selectAttributeReferenceAdditionalData(assignReferencesAttributeId, uniqueMetadata);
    handlers.selectAttributeReference(assignReferencesAttributeId, finalValues);
  }
}

export function getRichTextAttributesFromMap(
  attributes: AttributeInput[],
  values: GetRichTextValues,
): AttributeInput[] {
  return attributes
    .filter(({ data }) => data.inputType === AttributeInputTypeEnum.RICH_TEXT)
    .map(attribute => ({
      ...attribute,
      value: [JSON.stringify(values[attribute.id])],
    }));
}

export function getRichTextDataFromAttributes(
  attributes: AttributeInput[] = [],
): Record<string, string> {
  const keyValuePairs = attributes
    .filter(attribute => attribute.data.inputType === AttributeInputTypeEnum.RICH_TEXT)
    .map(attribute => [attribute.id, attribute.value[0]]);

  return Object.fromEntries(keyValuePairs);
}

export const getFileValuesToUploadFromAttributes = (
  attributesWithNewFileValue: FormsetData<null, File>,
) => attributesWithNewFileValue.filter(fileAttribute => !!fileAttribute.value);

const getFileValuesRemovedFromAttributes = (attributesWithNewFileValue: FormsetData<null, File>) =>
  attributesWithNewFileValue.filter(attribute => !attribute.value);

const getAttributesOfRemovedFiles = (
  fileAttributesRemoved: FormsetData<null, File>,
): AtributesOfFiles[] =>
  fileAttributesRemoved.map(attribute => ({
    file: undefined,
    id: attribute.id,
    contentType: attribute.value?.type,
    values: [],
  }));

const getAttributesOfUploadedFiles = (
  fileValuesToUpload: FormsetData<null, File>,
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
): AtributesOfFiles[] =>
  uploadFilesResult.map((uploadFileResult, index) => {
    const attribute = fileValuesToUpload[index];

    return {
      file: uploadFileResult.data?.fileUpload?.uploadedFile?.url,
      contentType: uploadFileResult.data?.fileUpload?.uploadedFile?.contentType,
      id: attribute.id,
      values: [],
    };
  });

export const getAttributesAfterFileAttributesUpdate = (
  attributesWithNewFileValue: FormsetData<null, File>,
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
): AttributeValueInput[] => {
  const removedFileValues = getFileValuesRemovedFromAttributes(attributesWithNewFileValue);
  const fileValuesToUpload = getFileValuesToUploadFromAttributes(attributesWithNewFileValue);
  const removedFileAttributes = getAttributesOfRemovedFiles(removedFileValues);
  const uploadedFileAttributes = getAttributesOfUploadedFiles(
    fileValuesToUpload,
    uploadFilesResult,
  );

  return uploadedFileAttributes.concat(removedFileAttributes);
};

const getFileAttributeDisplayData = (
  attribute: AttributeInput,
  attributesWithNewFileValue: FormsetData<null, File>,
) => {
  const attributeWithNewFileValue = attributesWithNewFileValue.find(
    attributeWithNewFile => attribute.id === attributeWithNewFile.id,
  );

  if (attributeWithNewFileValue) {
    return {
      ...attribute,
      value: attributeWithNewFileValue?.value?.name ? [attributeWithNewFileValue.value.name] : [],
    };
  }

  return attribute;
};

export interface ReferenceEntitiesSearch {
  pages?: RelayToFlat<NonNullable<SearchPagesQuery["search"]>>;
  products?: RelayToFlat<NonNullable<SearchProductsQuery["search"]>>;
  collections?: RelayToFlat<NonNullable<SearchCollectionsQuery["search"]>>;
  categories?: RelayToFlat<NonNullable<SearchCategoriesQuery["search"]>>;
}

const findPageReference = (
  valueId: string,
  references: ReferenceEntitiesSearch,
): AttributeReference | null => {
  if (!references.pages) return null;

  const page = references.pages.find(r => r.id === valueId);

  if (page) {
    return {
      label: page.title,
      value: valueId,
    };
  }

  return null;
};

const findProductReference = (
  valueId: string,
  references: ReferenceEntitiesSearch,
): AttributeReference | null => {
  if (!references.products) return null;

  const product = references.products.find(r => r.id === valueId);

  if (product) {
    return {
      label: product.name,
      value: valueId,
    };
  }

  return null;
};

const findCollectionReference = (
  valueId: string,
  references: ReferenceEntitiesSearch,
): AttributeReference | null => {
  if (!references.collections) return null;

  const collection = references.collections.find(r => r.id === valueId);

  if (collection) {
    return {
      label: collection.name,
      value: valueId,
    };
  }

  return null;
};

const findCategoryReference = (
  valueId: string,
  references: ReferenceEntitiesSearch,
): AttributeReference | null => {
  if (!references.categories) return null;

  const category = references.categories.find(r => r.id === valueId);

  if (category) {
    return {
      label: category.name,
      value: valueId,
    };
  }

  return null;
};

const findProductVariantReference = (
  valueId: string,
  referencesEntitiesSearchResult: ReferenceEntitiesSearch,
): AttributeReference | null => {
  if (!referencesEntitiesSearchResult.products) return null;

  // Search through products using cached variant maps
  for (const product of referencesEntitiesSearchResult.products) {
    const variant = productVariantCacheManager.getProductVariantById(product, valueId);

    if (variant) {
      return {
        label: `${product.name} ${variant.name}`,
        value: valueId,
      };
    }
  }

  return null;
};

const findReferenceByEntityType = (
  valueId: string,
  entityType: AttributeEntityTypeEnum | undefined,
  referencesEntitiesSearchResult: ReferenceEntitiesSearch,
): AttributeReference | null => {
  switch (entityType) {
    case AttributeEntityTypeEnum.PAGE:
      return findPageReference(valueId, referencesEntitiesSearchResult);
    case AttributeEntityTypeEnum.PRODUCT:
      return findProductReference(valueId, referencesEntitiesSearchResult);
    case AttributeEntityTypeEnum.COLLECTION:
      return findCollectionReference(valueId, referencesEntitiesSearchResult);
    case AttributeEntityTypeEnum.CATEGORY:
      return findCategoryReference(valueId, referencesEntitiesSearchResult);
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      return findProductVariantReference(valueId, referencesEntitiesSearchResult);
    default:
      return null;
  }
};

export const getReferenceAttributeDisplayData = (
  attribute: AttributeInput,
  referencesEntitiesSearchResult: ReferenceEntitiesSearch,
) => {
  return {
    ...attribute,
    data: {
      ...attribute.data,
      references:
        attribute.value && attribute.value.length > 0
          ? attribute.value.map(valueId => {
              /* "additionalData" is the cache for newly selected values from useFormset hook.
               * It is populated from the initial GraphQL payload
               * and whenever the user assigns references in the dialog into useFormset data. */
              const meta = attribute.additionalData?.find(m => m.value === valueId);

              if (meta) {
                return {
                  label: meta.label,
                  value: meta.value,
                };
              }

              /* As a fallback, look at the latest referenced entity search results.
               * This should cover scenarios where the user has just added a reference in modal
               * and metadata has not been updated yet.
               *
               * It's not default, because it can fail:
               * search query filters out references based on `referenceType` and use search query for filtering */
              const searchResult = findReferenceByEntityType(
                valueId,
                attribute.data.entityType,
                referencesEntitiesSearchResult,
              );

              if (searchResult) {
                return searchResult;
              }

              // Fallback: Look up the name from attribute.data.values
              // This array contains the correct mapping of reference ID to entity name
              const valueWithName = attribute.data.values.find(val => val.reference === valueId);

              if (valueWithName) {
                return {
                  label: valueWithName.name,
                  value: valueId,
                };
              }

              // Ultimate fallback if not found anywhere
              return {
                label: valueId,
                value: valueId,
              };
            })
          : [],
    },
  };
};

export const getAttributesDisplayData = (
  attributes: AttributeInput[],
  attributesWithNewFileValue: FormsetData<null, File>,
  references: ReferenceEntitiesSearch,
) =>
  attributes.map(attribute => {
    if (
      attribute.data.inputType === AttributeInputTypeEnum.REFERENCE ||
      attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE
    ) {
      return getReferenceAttributeDisplayData(attribute, references);
    }

    if (attribute.data.inputType === AttributeInputTypeEnum.FILE) {
      return getFileAttributeDisplayData(attribute, attributesWithNewFileValue);
    }

    return attribute;
  });

export const getReferenceAttributeEntityTypeFromAttribute = (
  attributeId: string,
  attributes?: AttributeInput[],
): AttributeEntityTypeEnum | undefined => {
  return attributes?.find(attribute => attribute.id === attributeId)?.data?.entityType;
};
