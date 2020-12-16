import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Generics / File upload field", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <FileUploadField {...props} />)
  .add("with ready to upload file", () => (
    <FileUploadField
      {...props}
      file={{
        label: "some_file.png",
        value: "some_file.png"
      }}
    />
  ))
  .add("with uploaded file", () => (
    <FileUploadField
      {...props}
      file={{
        file: fixtures.UPLOADED_FILE,
        label: "some_file_with_link.png",
        value: "some_file_with_link.png"
      }}
    />
  ))
  .add("with error", () => (
    <FileUploadField
      {...props}
      error={true}
      helperText="Something went wrong"
    />
  ))
  .add("interactive", () => <InteractiveStory />);
