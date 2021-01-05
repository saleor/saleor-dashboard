import { AttributeInput } from "@saleor/components/Attributes";
import { FileUpload } from "@saleor/files/types/FileUpload";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { SelectedVariantAttributeFragment } from "@saleor/fragments/types/SelectedVariantAttributeFragment";
import { UploadErrorFragment } from "@saleor/fragments/types/UploadErrorFragment";
import { FormsetData } from "@saleor/hooks/useFormset";
import { PageDetails_page_attributes } from "@saleor/pages/types/PageDetails";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import {
  AttributeInputTypeEnum,
  AttributeValueInput
} from "@saleor/types/globalTypes";
import { MutationFetchResult } from "react-apollo";

import { AttributeValueDelete } from "../types/AttributeValueDelete";

export const isFileValueUnused = (
  attributesWithNewFileValue: FormsetData<null, File>,
  existingAttribute:
    | PageDetails_page_attributes
    | SelectedVariantAttributeFragment
) => {
  if (existingAttribute.attribute.inputType !== AttributeInputTypeEnum.FILE) {
    return false;
  }
  if (existingAttribute.values.length === 0) {
    return false;
  }

  const modifiedAttribute = attributesWithNewFileValue.find(
    dataAttribute => dataAttribute.id === existingAttribute.attribute.id
  );

  return !!modifiedAttribute;
};

export const mergeFileUploadErrors = (
  uploadFilesResult: Array<MutationFetchResult<FileUpload>>
): UploadErrorFragment[] =>
  uploadFilesResult.reduce((errors, uploadFileResult) => {
    const uploadErrors = uploadFileResult?.data?.fileUpload?.uploadErrors;
    if (uploadErrors) {
      return [...errors, ...uploadErrors];
    }
    return errors;
  }, []);

export const mergeAttributeValueDeleteErrors = (
  deleteAttributeValuesResult: Array<MutationFetchResult<AttributeValueDelete>>
): AttributeErrorFragment[] =>
  deleteAttributeValuesResult.reduce((errors, deleteValueResult) => {
    const deleteErrors = deleteValueResult?.data?.attributeValueDelete?.errors;
    if (deleteErrors) {
      return [...errors, ...deleteErrors];
    }
    return errors;
  }, []);

export const getFileValuesToUploadFromAttributes = (
  attributesWithNewFileValue: FormsetData<null, File>
) => attributesWithNewFileValue.filter(fileAttribute => !!fileAttribute.value);

export const getFileValuesRemovedFromAttributes = (
  attributesWithNewFileValue: FormsetData<null, File>
) => attributesWithNewFileValue.filter(attribute => !attribute.value);

export const getAttributesOfRemovedFiles = (
  fileAttributesRemoved: FormsetData<null, File>
) =>
  fileAttributesRemoved.map(attribute => ({
    file: undefined,
    id: attribute.id,
    values: []
  }));

export const getAttributesOfUploadedFiles = (
  fileValuesToUpload: FormsetData<null, File>,
  uploadFilesResult: Array<MutationFetchResult<FileUpload>>
) =>
  uploadFilesResult.map((uploadFileResult, index) => {
    const attribute = fileValuesToUpload[index];

    return {
      file: uploadFileResult.data.fileUpload.uploadedFile.url,
      id: attribute.id,
      values: []
    };
  });

export const getAttributesAfterFileAttributesUpdate = (
  attributesWithNewFileValue: FormsetData<null, File>,
  uploadFilesResult: Array<MutationFetchResult<FileUpload>>
): AttributeValueInput[] => {
  const removedFileValues = getFileValuesRemovedFromAttributes(
    attributesWithNewFileValue
  );
  const fileValuesToUpload = getFileValuesToUploadFromAttributes(
    attributesWithNewFileValue
  );

  const removedFileAttributes = getAttributesOfRemovedFiles(removedFileValues);
  const uploadedFileAttributes = getAttributesOfUploadedFiles(
    fileValuesToUpload,
    uploadFilesResult
  );

  return uploadedFileAttributes.concat(removedFileAttributes);
};

export const getAttributesDisplayData = (
  attributes: AttributeInput[],
  attributesWithNewFileValue: FormsetData<null, File>,
  referencePages: SearchPages_search_edges_node[]
) =>
  attributes.map(attribute => {
    if (attribute.data.inputType === AttributeInputTypeEnum.REFERENCE) {
      return {
        ...attribute,
        data: {
          ...attribute.data,
          references:
            referencePages &&
            attribute.value?.map(value =>
              referencePages.find(reference => reference.id === value)
            )
        }
      };
    }

    const attributeWithNewFileValue = attributesWithNewFileValue.find(
      attributeWithNewFile => attribute.id === attributeWithNewFile.id
    );

    if (attributeWithNewFileValue) {
      return {
        ...attribute,
        value: attributeWithNewFileValue?.value?.name
          ? [attributeWithNewFileValue.value.name]
          : []
      };
    }
    return attribute;
  });
