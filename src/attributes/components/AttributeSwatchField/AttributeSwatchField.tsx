import Spacer from "@saleor/apps/components/Spacer";
import { inputTypeMessages } from "@saleor/attributes/components/AttributeDetails/messages";
import { AttributeValueEditDialogFormData } from "@saleor/attributes/utils/data";
import { ColorPicker } from "@saleor/components/ColorPicker";
import FileUploadField from "@saleor/components/FileUploadField";
import { RadioGroupField } from "@saleor/components/RadioGroupField";
import { useFileUploadMutation } from "@saleor/files/mutations";
import { UseFormResult } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import commonErrorMessages from "@saleor/utils/errors/common";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as M from "./messages";

const useStyles = makeStyles(
  theme => ({
    filePreview: {
      marginTop: theme.spacing(3),
      width: 216,
      height: 216,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }),
  { name: "AttributeSwatchField" }
);

type AttributeSwatchFieldProps<T> = Pick<
  UseFormResult<T>,
  "setError" | "set" | "errors" | "clearErrors" | "data"
>;

type SwatchType = "picker" | "image";

const AttributeSwatchField: React.FC<AttributeSwatchFieldProps<
  AttributeValueEditDialogFormData
>> = ({ set, ...props }) => {
  const { data } = props;
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const [uploadFile] = useFileUploadMutation({});
  const [type, setType] = useState<SwatchType>(
    data.fileUrl ? "image" : "picker"
  );

  const handleColorChange = (hex: string) =>
    set({ value: hex, fileUrl: undefined, contentType: undefined });

  const handleFileUpload = async (file: File) => {
    setProcessing(true);

    const {
      data: { fileUpload }
    } = await uploadFile({ variables: { file } });

    if (fileUpload.errors?.length) {
      props.setError("fileUrl", formatMessage(commonErrorMessages.invalid));
    } else {
      set({
        fileUrl: fileUpload.uploadedFile.url,
        contentType: fileUpload.uploadedFile.contentType,
        value: undefined
      });
    }

    setProcessing(false);
  };

  const handleFileDelete = () =>
    set({
      fileUrl: undefined,
      contentType: undefined,
      value: undefined
    });

  return (
    <>
      <Spacer type="vertical" spacing={2} />
      <RadioGroupField
        choices={[
          { label: formatMessage(M.defined.picker), value: "picker" },
          { label: formatMessage(M.defined.image), value: "image" }
        ]}
        variant="inline"
        label={<FormattedMessage {...inputTypeMessages.swatch} />}
        name="swatch"
        value={type}
        onChange={evt => setType(evt.target.value)}
        data-test="swatch-radio"
      />
      {type === "image" ? (
        <>
          <FileUploadField
            disabled={processing}
            loading={processing}
            file={{ label: null, value: null, file: null }}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />

          {data.fileUrl && (
            <div
              className={classes.filePreview}
              style={{ backgroundImage: `url(${data.fileUrl})` }}
            />
          )}
        </>
      ) : (
        <ColorPicker {...props} onColorChange={handleColorChange} />
      )}
    </>
  );
};

AttributeSwatchField.displayName = "AttributeSwatchField";
export default AttributeSwatchField;
