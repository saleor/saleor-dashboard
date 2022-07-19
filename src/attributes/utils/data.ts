import { FetchResult } from "@apollo/client";
import {
  AttributeInput,
  AttributeInputData,
} from "@saleor/components/Attributes";
import {
  AttributeEntityTypeEnum,
  AttributeErrorFragment,
  AttributeFragment,
  AttributeInputTypeEnum,
  AttributeValueDeleteMutation,
  AttributeValueFragment,
  AttributeValueInput,
  FileUploadMutation,
  Node,
  PageSelectedAttributeFragment,
  ProductFragment,
  SearchPagesQuery,
  SearchProductsQuery,
  SelectedVariantAttributeFragment,
  UploadErrorFragment,
  VariantAttributeFragment,
} from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import { RelayToFlat } from "@saleor/types";
import {
  mapEdgesToItems,
  mapNodeToChoice,
  mapPagesToChoices,
} from "@saleor/utils/maps";
import { RichTextContextValues } from "@saleor/utils/richText/context";
import {
  GetRichTextValues,
  RichTextGetters,
} from "@saleor/utils/richText/useMultipleRichText";

import { AttributePageFormData } from "../components/AttributePage";

type AtributesOfFiles = Pick<
  AttributeValueInput,
  "file" | "id" | "values" | "contentType"
>;

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

export function filterable(
  attribute: Pick<AttributeFragment, "inputType">,
): boolean {
  return ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(
    attribute.inputType,
  );
}

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
    name: data?.name,
    value: data?.value,
    contentType: data?.file?.contentType,
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
    availableInGrid: undefined,
    filterableInDashboard: undefined,
    filterableInStorefront: undefined,
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

export function getDefaultAttributeValues(attribute: VariantAttributeFragment) {
  switch (attribute.inputType) {
    case AttributeInputTypeEnum.BOOLEAN:
      return ["false"];

    default:
      return [];
  }
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

    case AttributeInputTypeEnum.PLAIN_TEXT:
      return [attribute.values[0]?.plainText];

    case AttributeInputTypeEnum.RICH_TEXT:
      return [attribute.values[0]?.richText];

    case AttributeInputTypeEnum.NUMERIC:
      return [attribute.values[0]?.name];

    case AttributeInputTypeEnum.BOOLEAN:
      return [attribute.values[0]?.boolean ?? "false"];

    case AttributeInputTypeEnum.DATE:
      return [attribute.values[0]?.date];

    case AttributeInputTypeEnum.DATE_TIME:
      return [attribute.values[0]?.dateTime];

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
  }, []);

export const mergeAttributeValueDeleteErrors = (
  deleteAttributeValuesResult: Array<FetchResult<AttributeValueDeleteMutation>>,
): AttributeErrorFragment[] =>
  deleteAttributeValuesResult.reduce((errors, deleteValueResult) => {
    const deleteErrors = deleteValueResult?.data?.attributeValueDelete?.errors;
    if (deleteErrors) {
      return [...errors, ...deleteErrors];
    }
    return errors;
  }, []);

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

  return attribute.value
    ? [...attribute.value, ...attributeValues]
    : attributeValues;
};

export const mergeAttributes = (
  ...attributeLists: AttributeInput[][]
): AttributeInput[] =>
  attributeLists.reduce((prev, attributes) => {
    const newAttributeIds = new Set(attributes.map(attr => attr.id));
    return [
      ...prev.filter(attr => !newAttributeIds.has(attr.id)),
      ...attributes,
    ];
  }, []);

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
    .filter(
      attribute =>
        attribute.data.inputType === AttributeInputTypeEnum.RICH_TEXT,
    )
    .map(attribute => [attribute.id, attribute.value[0]]);

  return Object.fromEntries(keyValuePairs);
}

export const getFileValuesToUploadFromAttributes = (
  attributesWithNewFileValue: FormsetData<null, File>,
) => attributesWithNewFileValue.filter(fileAttribute => !!fileAttribute.value);

export const getFileValuesRemovedFromAttributes = (
  attributesWithNewFileValue: FormsetData<null, File>,
) => attributesWithNewFileValue.filter(attribute => !attribute.value);

export const getAttributesOfRemovedFiles = (
  fileAttributesRemoved: FormsetData<null, File>,
): AtributesOfFiles[] =>
  fileAttributesRemoved.map(attribute => ({
    file: undefined,
    id: attribute.id,
    contentType: attribute.value?.type,
    values: [],
  }));

export const getAttributesOfUploadedFiles = (
  fileValuesToUpload: FormsetData<null, File>,
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
): AtributesOfFiles[] =>
  uploadFilesResult.map((uploadFileResult, index) => {
    const attribute = fileValuesToUpload[index];

    return {
      file: uploadFileResult.data.fileUpload.uploadedFile.url,
      contentType: uploadFileResult.data.fileUpload.uploadedFile.contentType,
      id: attribute.id,
      values: [],
    };
  });

export const getAttributesAfterFileAttributesUpdate = (
  attributesWithNewFileValue: FormsetData<null, File>,
  uploadFilesResult: Array<FetchResult<FileUploadMutation>>,
): AttributeValueInput[] => {
  const removedFileValues = getFileValuesRemovedFromAttributes(
    attributesWithNewFileValue,
  );
  const fileValuesToUpload = getFileValuesToUploadFromAttributes(
    attributesWithNewFileValue,
  );

  const removedFileAttributes = getAttributesOfRemovedFiles(removedFileValues);
  const uploadedFileAttributes = getAttributesOfUploadedFiles(
    fileValuesToUpload,
    uploadFilesResult,
  );

  return uploadedFileAttributes.concat(removedFileAttributes);
};

export const getFileAttributeDisplayData = (
  attribute: AttributeInput,
  attributesWithNewFileValue: FormsetData<null, File>,
) => {
  const attributeWithNewFileValue = attributesWithNewFileValue.find(
    attributeWithNewFile => attribute.id === attributeWithNewFile.id,
  );

  if (attributeWithNewFileValue) {
    return {
      ...attribute,
      value: attributeWithNewFileValue?.value?.name
        ? [attributeWithNewFileValue.value.name]
        : [],
    };
  }
  return attribute;
};

export const getPageReferenceAttributeDisplayData = (
  attribute: AttributeInput,
  referencePages: RelayToFlat<SearchPagesQuery["search"]>,
) => ({
  ...attribute,
  data: {
    ...attribute.data,
    references:
      referencePages?.length > 0 && attribute.value?.length > 0
        ? mapPagesToChoices(
            attribute.value.map(value => {
              const reference = referencePages.find(
                reference => reference.id === value,
              );
              return { ...reference };
            }),
          )
        : [],
  },
});

export const getProductReferenceAttributeDisplayData = (
  attribute: AttributeInput,
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>,
) => ({
  ...attribute,
  data: {
    ...attribute.data,
    references:
      referenceProducts?.length > 0 && attribute.value?.length > 0
        ? mapNodeToChoice(
            attribute.value.map(value => {
              const reference = referenceProducts.find(
                reference => reference.id === value,
              );
              return { ...reference };
            }),
          )
        : [],
  },
});

export const getReferenceAttributeDisplayData = (
  attribute: AttributeInput,
  referencePages: RelayToFlat<SearchPagesQuery["search"]>,
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>,
) => {
  if (attribute.data.entityType === AttributeEntityTypeEnum.PAGE) {
    return getPageReferenceAttributeDisplayData(attribute, referencePages);
  } else if (attribute.data.entityType === AttributeEntityTypeEnum.PRODUCT) {
    return getProductReferenceAttributeDisplayData(
      attribute,
      referenceProducts,
    );
  }
};

export const getAttributesDisplayData = (
  attributes: AttributeInput[],
  attributesWithNewFileValue: FormsetData<null, File>,
  referencePages: RelayToFlat<SearchPagesQuery["search"]>,
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>,
) =>
  attributes.map(attribute => {
    if (attribute.data.inputType === AttributeInputTypeEnum.REFERENCE) {
      return getReferenceAttributeDisplayData(
        attribute,
        referencePages,
        referenceProducts,
      );
    }
    if (attribute.data.inputType === AttributeInputTypeEnum.FILE) {
      return getFileAttributeDisplayData(attribute, attributesWithNewFileValue);
    }
    return attribute;
  });

export const getSelectedReferencesFromAttribute = <T extends Node>(
  attribute?: AttributeInput,
  references?: T[],
) =>
  references?.filter(
    value =>
      !attribute?.value?.some(selectedValue => selectedValue === value.id),
  ) || [];

export const getAttributeValuesFromReferences = (
  attributeId: string,
  attributes?: AttributeInput[],
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>,
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>,
) => {
  const attribute = attributes?.find(attribute => attribute.id === attributeId);

  if (attribute?.data?.entityType === AttributeEntityTypeEnum.PAGE) {
    return mapPagesToChoices(
      getSelectedReferencesFromAttribute(attribute, referencePages),
    );
  } else if (attribute?.data?.entityType === AttributeEntityTypeEnum.PRODUCT) {
    return mapNodeToChoice(
      getSelectedReferencesFromAttribute(attribute, referenceProducts),
    );
  }
  return [];
};
