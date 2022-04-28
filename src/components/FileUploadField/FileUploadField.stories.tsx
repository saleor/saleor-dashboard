import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React, { useState } from "react";

import FileUploadField, { FileUploadFieldProps } from "./FileUploadField";
import * as fixtures from "./fixtures";

const props: FileUploadFieldProps = {
  disabled: false,
  file: { label: undefined, value: undefined },
  inputProps: {
    name: "country",
    placeholder: "Select country"
  },
  loading: false,
  onFileDelete: () => undefined,
  onFileUpload: () => undefined
};

const InteractiveStory: React.FC = () => {
  const [file, setFile] = useState<File>();

  return (
    <FileUploadField
      disabled={false}
      loading={false}
      file={{
        label: file?.name,
        value: file?.name
      }}
      onFileUpload={file => setFile(file)}
      onFileDelete={() => setFile(null)}
    />
  );
};

export default {
  title: "Generics / File upload field",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => <FileUploadField {...props} />;

Default.story = {
  name: "default"
};

export const WithReadyToUploadFile = () => (
  <FileUploadField
    {...props}
    file={{
      label: "some_file.png",
      value: "some_file.png"
    }}
  />
);

WithReadyToUploadFile.story = {
  name: "with ready to upload file"
};

export const WithUploadedFile = () => (
  <FileUploadField
    {...props}
    file={{
      file: fixtures.UPLOADED_FILE,
      label: "some_file_with_link.png",
      value: "some_file_with_link.png"
    }}
  />
);

WithUploadedFile.story = {
  name: "with uploaded file"
};

export const WithError = () => (
  <FileUploadField {...props} error={true} helperText="Something went wrong" />
);

WithError.story = {
  name: "with error"
};

export const Interactive = () => <InteractiveStory />;

Interactive.story = {
  name: "interactive"
};
