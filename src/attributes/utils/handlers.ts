import {
  AttributeInput,
  AttributeInputData
} from "@saleor/components/Attributes";
import {
  FileUpload,
  FileUploadVariables
} from "@saleor/files/types/FileUpload";
import {
  FormsetAtomicData,
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { PageDetails_page_attributes } from "@saleor/pages/types/PageDetails";
import { ProductDetails_product_attributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantDetails_productVariant_nonSelectionAttributes } from "@saleor/products/types/ProductVariantDetails";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeValueInput
} from "@saleor/types/globalTypes";
import { move, toggle } from "@saleor/utils/lists";
import { MutationFetchResult } from "react-apollo";

import {
  AttributeValueDelete,
  AttributeValueDeleteVariables
} from "../types/AttributeValueDelete";
import { getFileValuesToUploadFromAttributes, isFileValueUnused } from "./data";

export function createAttributeChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void
): FormsetChange<string> {
  return (attributeId: string, value: string) => {
    triggerChange();
    changeAttributeData(attributeId, value === "" ? [] : [value]);
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<AttributeInputData, string[]>,
  triggerChange: () => void
): FormsetChange<string> {
  return (attributeId: string, value: string) => {
    const attribute = attributes.find(
      attribute => attribute.id === attributeId
    );

    const newAttributeValues = toggle(
      value,
      attribute.value,
      (a, b) => a === b
    );

    triggerChange();
    changeAttributeData(attributeId, newAttributeValues);
  };
}

export function createAttributeReferenceChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void
): FormsetChange<string[]> {
  return (attributeId: string, values: string[]) => {
    changeAttributeData(attributeId, values);
    triggerChange();
  };
}

export function createFetchReferencesHandler(
  attributes: FormsetData<AttributeInputData, string[]>,
  assignReferencesAttributeId: string,
  fetchReferencePages?: (data: string) => void,
  fetchReferenceProducts?: (data: string) => void
) {
  return (value: string) => {
    const attribute = attributes?.find(
      attribute => attribute.id === assignReferencesAttributeId
    );

    if (!attribute) {
      return;
    }

    if (
      attribute.data.entityType === AttributeEntityTypeEnum.PAGE &&
      fetchReferencePages
    ) {
      fetchReferencePages(value);
    } else if (
      attribute.data.entityType === AttributeEntityTypeEnum.PRODUCT &&
      fetchReferenceProducts
    ) {
      fetchReferenceProducts(value);
    }
  };
}

export function createFetchMoreReferencesHandler(
  attributes: FormsetData<AttributeInputData, string[]>,
  assignReferencesAttributeId: string,
  fetchMoreReferencePages?: FetchMoreProps,
  fetchMoreReferenceProducts?: FetchMoreProps
) {
  const attribute = attributes?.find(
    attribute => attribute.id === assignReferencesAttributeId
  );

  if (!attribute) {
    return;
  }

  if (attribute.data.entityType === AttributeEntityTypeEnum.PAGE) {
    return fetchMoreReferencePages;
  } else if (attribute.data.entityType === AttributeEntityTypeEnum.PRODUCT) {
    return fetchMoreReferenceProducts;
  }
}

export function createAttributeFileChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributesWithNewFileValue: FormsetData<FormsetData<null, File>>,
  addAttributeNewFileValue: (data: FormsetAtomicData<null, File>) => void,
  changeAttributeNewFileValue: FormsetChange<File>,
  triggerChange: () => void
): FormsetChange<File> {
  return (attributeId: string, value: File) => {
    triggerChange();

    const newFileValueAssigned = attributesWithNewFileValue.find(
      attribute => attribute.id === attributeId
    );

    if (newFileValueAssigned) {
      changeAttributeNewFileValue(attributeId, value);
    } else {
      addAttributeNewFileValue({
        data: null,
        id: attributeId,
        label: null,
        value
      });
    }

    changeAttributeData(attributeId, value ? [value.name] : []);
  };
}

export function createAttributeValueReorderHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<AttributeInputData, string[]>,
  triggerChange: () => void
): FormsetChange<ReorderEvent> {
  return (attributeId: string, reorder: ReorderEvent) => {
    triggerChange();

    const attribute = attributes.find(
      attribute => attribute.id === attributeId
    );

    const reorderedValues = move(
      attribute.value[reorder.oldIndex],
      attribute.value,
      (a, b) => a === b,
      reorder.newIndex
    );

    changeAttributeData(attributeId, reorderedValues);
  };
}

interface AttributesArgs {
  attributes: AttributeInput[];
  updatedFileAttributes: AttributeValueInput[];
}

function getFileInput(
  attribute: AttributeInput,
  updatedFileAttributes: AttributeValueInput[]
) {
  const updatedFileAttribute = updatedFileAttributes.find(
    attributeWithNewFile => attribute.id === attributeWithNewFile.id
  );

  if (updatedFileAttribute) {
    return {
      file: updatedFileAttribute.file,
      id: updatedFileAttribute.id,
      contentType: updatedFileAttribute.contentType
    };
  }
  return {
    file: attribute.data.selectedValues?.[0]?.file?.url,
    contentType: attribute.data.selectedValues?.[0]?.file.contentType,
    id: attribute.id
  };
}

function getReferenceInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    references: attribute.value
  };
}

function getRichTextInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    richText: attribute.value[0]
  };
}

function getBooleanInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    boolean: JSON.parse(attribute.value[0] ?? "false")
  };
}

function getDateInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    date: attribute.value[0]
  };
}

function getDateTimeInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    dateTime: attribute.value[0]
  };
}

function getDefaultInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    values: ["", undefined, null].includes(attribute.value[0])
      ? []
      : attribute.value
  };
}

export const prepareAttributesInput = ({
  attributes,
  updatedFileAttributes
}: AttributesArgs): AttributeValueInput[] =>
  attributes.map(attribute => {
    switch (attribute.data.inputType) {
      case AttributeInputTypeEnum.FILE:
        return getFileInput(attribute, updatedFileAttributes);

      case AttributeInputTypeEnum.REFERENCE:
        return getReferenceInput(attribute);

      case AttributeInputTypeEnum.RICH_TEXT:
        return getRichTextInput(attribute);

      case AttributeInputTypeEnum.BOOLEAN:
        return getBooleanInput(attribute);

      case AttributeInputTypeEnum.DATE:
        return getDateInput(attribute);

      case AttributeInputTypeEnum.DATE_TIME:
        return getDateTimeInput(attribute);

      default:
        return getDefaultInput(attribute);
    }
  });

export const handleUploadMultipleFiles = async (
  attributesWithNewFileValue: FormsetData<null, File>,
  uploadFile: (
    variables: FileUploadVariables
  ) => Promise<MutationFetchResult<FileUpload>>
) =>
  Promise.all(
    getFileValuesToUploadFromAttributes(attributesWithNewFileValue).map(
      fileAttribute =>
        uploadFile({
          file: fileAttribute.value
        })
    )
  );

export const handleDeleteMultipleAttributeValues = async (
  attributesWithNewFileValue: FormsetData<null, File>,
  attributes: Array<
    | PageDetails_page_attributes
    | ProductDetails_product_attributes
    | ProductVariantDetails_productVariant_nonSelectionAttributes
  >,
  deleteAttributeValue: (
    variables: AttributeValueDeleteVariables
  ) => Promise<MutationFetchResult<AttributeValueDelete>>
) =>
  Promise.all(
    attributes.map(existingAttribute => {
      const fileValueUnused = isFileValueUnused(
        attributesWithNewFileValue,
        existingAttribute
      );

      if (fileValueUnused) {
        return deleteAttributeValue({
          id: existingAttribute.values[0].id,
          firstValues: 20
        });
      }
    })
  );
