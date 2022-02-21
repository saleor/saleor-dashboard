import { gql } from "@apollo/client";
import { uploadErrorFragment } from "@saleor/fragments/errors";
import { fileFragment } from "@saleor/fragments/file";
import makeMutation from "@saleor/hooks/makeMutation";

import { FileUpload, FileUploadVariables } from "./types/FileUpload";

const fileUploadMutation = gql`
  ${fileFragment}
  ${uploadErrorFragment}
  mutation FileUpload($file: Upload!) {
    fileUpload(file: $file) {
      uploadedFile {
        ...FileFragment
      }
      errors {
        ...UploadErrorFragment
      }
    }
  }
`;
export const useFileUploadMutation = makeMutation<
  FileUpload,
  FileUploadVariables
>(fileUploadMutation);
