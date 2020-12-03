import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React, { useState } from "react";

import FileUploadField, { FileUploadFieldProps } from "./FileUploadField";

const props: FileUploadFieldProps = {
  disabled: false,
  name: "country",
  onFileDelete: () => undefined,
  onFileUpload: () => undefined,
  placeholder: "Select country"
};

const InteractiveStory: React.FC = () => {
  const [file, setFile] = useState<File>();

  return (
    <FileUploadField
      disabled={false}
      fileName={file?.name}
      onFileUpload={file => setFile(file)}
      onFileDelete={() => setFile(null)}
    />
  );
};

storiesOf("Generics / File upload field", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <FileUploadField {...props} />)
  .add("with file", () => (
    <FileUploadField {...props} fileName="some_file.png" />
  ))
  .add("interactive", () => <InteractiveStory />);
