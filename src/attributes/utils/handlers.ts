import { AttributeInput } from "@saleor/components/Attributes";
import {
  FileUpload,
  FileUploadVariables
} from "@saleor/files/types/FileUpload";
import { FormsetData } from "@saleor/hooks/useFormset";
import {
  AttributeInputTypeEnum,
  AttributeValueInput
} from "@saleor/types/globalTypes";
import { MutationFetchResult } from "react-apollo";

import { getFileValuesToUploadFromAttributes } from "./data";

interface AttributesArgs {
  attributes: AttributeInput[];
  attributesWithAddedNewFiles: AttributeValueInput[];
}

export const prepareAttributesInput = ({
  attributes,
  attributesWithAddedNewFiles
}: AttributesArgs): AttributeValueInput[] =>
  attributes.map(attribute => {
    if (attribute.data.inputType === AttributeInputTypeEnum.FILE) {
      const attributeWithNewFile = attributesWithAddedNewFiles.find(
        attributeWithNewFile => attribute.id === attributeWithNewFile.id
      );
      if (attributeWithNewFile) {
        return {
          file: attributeWithNewFile.file,
          id: attributeWithNewFile.id
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
