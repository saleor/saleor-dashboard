import { FetchResult } from "@apollo/client";
import {
  AttributeInput,
  AttributeInputData,
} from "@saleor/components/Attributes";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeValueDeleteMutation,
  AttributeValueDeleteMutationVariables,
  AttributeValueInput,
  FileUploadMutation,
  FileUploadMutationVariables,
  PageSelectedAttributeFragment,
  ProductFragment,
  ProductVariantDetailsQuery,
} from "@saleor/graphql";
import {
  FormsetAtomicData,
  FormsetChange,
  FormsetData,
} from "@saleor/hooks/useFormset";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import { move, toggle } from "@saleor/utils/lists";
import isEqual from "lodash/isEqual";

import { getFileValuesToUploadFromAttributes, isFileValueUnused } from "./data";

export function createAttributeChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void,
): FormsetChange<string> {
  return (attributeId: string, value: string) => {
    triggerChange();
    changeAttributeData(attributeId, value === "" ? [] : [value]);
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<AttributeInputData, string[]>,
  triggerChange: () => void,
): FormsetChange<string> {
  return (attributeId: string, value: string) => {
    const attribute = attributes.find(
      attribute => attribute.id === attributeId,
    );

    const newAttributeValues = toggle(
      value,
      attribute.value,
      (a, b) => a === b,
    );

    triggerChange();
    changeAttributeData(attributeId, newAttributeValues);
  };
}

export function createAttributeReferenceChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void,
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
  fetchReferenceProducts?: (data: string) => void,
) {
  return (value: string) => {
    const attribute = attributes?.find(
      attribute => attribute.id === assignReferencesAttributeId,
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
  fetchMoreReferenceProducts?: FetchMoreProps,
) {
  const attribute = attributes?.find(
    attribute => attribute.id === assignReferencesAttributeId,
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
  triggerChange: () => void,
): FormsetChange<File> {
  return (attributeId: string, value: File) => {
    triggerChange();

    const newFileValueAssigned = attributesWithNewFileValue.find(
      attribute => attribute.id === attributeId,
    );

    if (newFileValueAssigned) {
      changeAttributeNewFileValue(attributeId, value);
    } else {
      addAttributeNewFileValue({
        data: null,
        id: attributeId,
        label: null,
        value,
      });
    }

    changeAttributeData(attributeId, value ? [value.name] : []);
  };
}

export function createAttributeValueReorderHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<AttributeInputData, string[]>,
  triggerChange: () => void,
): FormsetChange<ReorderEvent> {
  return (attributeId: string, reorder: ReorderEvent) => {
    triggerChange();

    const attribute = attributes.find(
      attribute => attribute.id === attributeId,
    );

    const reorderedValues = move(
      attribute.value[reorder.oldIndex],
      attribute.value,
      (a, b) => a === b,
      reorder.newIndex,
    );

    changeAttributeData(attributeId, reorderedValues);
  };
}

function getFileInput(
  attribute: AttributeInput,
  updatedFileAttributes: AttributeValueInput[],
) {
  const updatedFileAttribute = updatedFileAttributes.find(
    attributeWithNewFile => attribute.id === attributeWithNewFile.id,
  );

  if (updatedFileAttribute) {
    return {
      file: updatedFileAttribute.file,
      id: updatedFileAttribute.id,
      contentType: updatedFileAttribute.contentType,
    };
  }
  return {
    file: attribute.data.selectedValues?.[0]?.file?.url,
    contentType: attribute.data.selectedValues?.[0]?.file.contentType,
    id: attribute.id,
  };
}

function getBooleanInput(attribute: AttributeInput) {
  return {
    id: attribute.id,
    boolean: JSON.parse(attribute.value[0] ?? "false"),
  };
}

function getAttributesMap(attributes: AttributeInput[] | null) {
  if (attributes && attributes?.length !== 0) {
    return new Map(
      attributes.map(attribute => [attribute.id, attribute.value]),
    );
  }
  return new Map();
}

interface AttributesArgs {
  attributes: AttributeInput[];
  prevAttributes: AttributeInput[] | null;
  updatedFileAttributes: AttributeValueInput[];
}

export const prepareAttributesInput = ({
  attributes,
  prevAttributes,
  updatedFileAttributes,
}: AttributesArgs): AttributeValueInput[] => {
  const prevAttributesMap = getAttributesMap(prevAttributes);

  return attributes.reduce((attrInput: AttributeValueInput[], attr) => {
    const prevAttrValue = prevAttributesMap.get(attr.id);
    if (isEqual(attr.value, prevAttrValue)) {
      return attrInput;
    }

    const inputType = attr.data.inputType;
    if (inputType === AttributeInputTypeEnum.FILE) {
      const fileInput = getFileInput(attr, updatedFileAttributes);
      if (fileInput.file) {
        attrInput.push(fileInput);
      }
      return attrInput;
    }
    if (inputType === AttributeInputTypeEnum.BOOLEAN) {
      const booleanInput = getBooleanInput(attr);
      // previous comparison doesn't work because value was string
      if (isEqual([booleanInput.boolean], prevAttrValue)) {
        return attrInput;
      }

      attrInput.push(booleanInput);
      return attrInput;
    }
    if (inputType === AttributeInputTypeEnum.PLAIN_TEXT) {
      attrInput.push({
        id: attr.id,
        plainText: attr.value[0],
      });
      return attrInput;
    }
    if (inputType === AttributeInputTypeEnum.RICH_TEXT) {
      attrInput.push({
        id: attr.id,
        richText: attr.value[0],
      });
      return attrInput;
    }

    if (inputType === AttributeInputTypeEnum.REFERENCE) {
      attrInput.push({
        id: attr.id,
        references: attr.value,
      });
      return attrInput;
    }
    if (inputType === AttributeInputTypeEnum.DATE) {
      attrInput.push({
        id: attr.id,
        date: attr.value[0],
      });
      return attrInput;
    }
    if (inputType === AttributeInputTypeEnum.DATE_TIME) {
      attrInput.push({
        id: attr.id,
        dateTime: attr.value[0],
      });
      return attrInput;
    }

    attrInput.push({
      id: attr.id,
      values: attr.value,
    });

    return attrInput;
  }, []);
};

export const handleUploadMultipleFiles = async (
  attributesWithNewFileValue: FormsetData<null, File>,
  uploadFile: (
    variables: FileUploadMutationVariables,
  ) => Promise<FetchResult<FileUploadMutation>>,
) =>
  Promise.all(
    getFileValuesToUploadFromAttributes(attributesWithNewFileValue).map(
      fileAttribute =>
        uploadFile({
          file: fileAttribute.value,
        }),
    ),
  );

export const handleDeleteMultipleAttributeValues = async (
  attributesWithNewFileValue: FormsetData<null, File>,
  attributes: Array<
    | PageSelectedAttributeFragment
    | ProductFragment["attributes"][0]
    | ProductVariantDetailsQuery["productVariant"]["nonSelectionAttributes"][0]
  >,
  deleteAttributeValue: (
    variables: AttributeValueDeleteMutationVariables,
  ) => Promise<FetchResult<AttributeValueDeleteMutation>>,
) =>
  Promise.all(
    attributes.map(existingAttribute => {
      const fileValueUnused = isFileValueUnused(
        attributesWithNewFileValue,
        existingAttribute,
      );

      if (fileValueUnused) {
        return deleteAttributeValue({
          id: existingAttribute.values[0].id,
          firstValues: 20,
        });
      }
    }),
  );
