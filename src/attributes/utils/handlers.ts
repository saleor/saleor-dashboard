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
import { ReorderEvent } from "@saleor/types";
import {
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

export const prepareAttributesInput = ({
  attributes,
  updatedFileAttributes
}: AttributesArgs): AttributeValueInput[] =>
  attributes.map(attribute => {
    if (attribute.data.inputType === AttributeInputTypeEnum.FILE) {
      const updatedFileAttribute = updatedFileAttributes.find(
        attributeWithNewFile => attribute.id === attributeWithNewFile.id
      );
      if (updatedFileAttribute) {
        return {
          file: updatedFileAttribute.file,
          id: updatedFileAttribute.id
        };
      }
      return {
        file:
          attribute.data.selectedValues &&
          attribute.data.selectedValues[0]?.file?.url,
        id: attribute.id
      };
    }
    if (attribute.data.inputType === AttributeInputTypeEnum.REFERENCE) {
      return {
        id: attribute.id,
        references: attribute.value
      };
    }
    return {
      id: attribute.id,
      values: attribute.value[0] === "" ? [] : attribute.value
    };
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
  attributes: PageDetails_page_attributes[],
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
          id: existingAttribute.values[0].id
        });
      }
    })
  );
