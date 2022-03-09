import { gql } from "@apollo/client";

export const fileUploadMutation = gql`
  mutation FileUpload($file: Upload!) {
    fileUpload(file: $file) {
      uploadedFile {
        ...File
      }
      errors {
        ...UploadError
      }
    }
  }
`;
