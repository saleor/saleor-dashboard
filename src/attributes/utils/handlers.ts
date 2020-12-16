import { AttributeInput } from "@saleor/components/Attributes";
import {
  FileUpload,
  FileUploadVariables
} from "@saleor/files/types/FileUpload";
import { FormsetData } from "@saleor/hooks/useFormset";
import { PageDetails_page_attributes } from "@saleor/pages/types/PageDetails";
import {
  AttributeInputTypeEnum,
  AttributeValueInput
} from "@saleor/types/globalTypes";
import { MutationFetchResult } from "react-apollo";

import {
  AttributeValueDelete,
  AttributeValueDeleteVariables
} from "../types/AttributeValueDelete";
import { getFileValuesToUploadFromAttributes, isFileValueUnused } from "./data";

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
