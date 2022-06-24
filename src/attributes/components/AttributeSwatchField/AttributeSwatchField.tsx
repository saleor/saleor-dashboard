import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import { inputTypeMessages } from "@saleor/attributes/components/AttributeDetails/messages";
import { AttributeValueEditDialogFormData } from "@saleor/attributes/utils/data";
import { ColorPicker } from "@saleor/components/ColorPicker";
import FileUploadField from "@saleor/components/FileUploadField";
import { RadioGroupField } from "@saleor/components/RadioGroupField";
import { useFileUploadMutation } from "@saleor/graphql";
import { UseFormResult } from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { errorMessages } from "@saleor/intl";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { swatchFieldMessages } from "./messages";
import { useStyles } from "./styles";

type AttributeSwatchFieldProps<T> = Pick<
  UseFormResult<T>,
  "setError" | "set" | "errors" | "clearErrors" | "data"
>;

type SwatchType = "picker" | "image";

const AttributeSwatchField: React.FC<AttributeSwatchFieldProps<
  AttributeValueEditDialogFormData
>> = ({ set, ...props }) => {
  const { data } = props;
  const notify = useNotifier();
  const intl = useIntl();
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const [uploadFile] = useFileUploadMutation({});
  const [type, setType] = useState<SwatchType>(
    data.fileUrl ? "image" : "picker",
  );

  const handleColorChange = (hex: string) =>
    set({ value: hex, fileUrl: undefined, contentType: undefined });

  const handleFileUpload = async (file: File) => {
    setProcessing(true);

    const {
      data: { fileUpload },
    } = await uploadFile({ variables: { file } });

    if (fileUpload.errors?.length) {
      notify({
        status: "error",
        title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
        text: intl.formatMessage(errorMessages.imageUploadErrorText),
      });
    } else {
      set({
        fileUrl: fileUpload.uploadedFile.url,
        contentType: fileUpload.uploadedFile.contentType,
        value: undefined,
      });
    }

    setProcessing(false);
  };

  const handleFileDelete = () =>
    set({
      fileUrl: undefined,
      contentType: undefined,
      value: undefined,
    });

  return (
    <>
      <VerticalSpacer spacing={2} />
      <RadioGroupField
        choices={[
          {
            label: formatMessage(swatchFieldMessages.picker),
            value: "picker",
          },
          {
            label: formatMessage(swatchFieldMessages.image),
            value: "image",
          },
        ]}
        variant="inline"
        label={<FormattedMessage {...inputTypeMessages.swatch} />}
        name="swatch"
        value={type}
        onChange={event => setType(event.target.value)}
        data-test-id="swatch-radio"
      />
      {type === "image" ? (
        <>
          <FileUploadField
            disabled={processing}
            loading={processing}
            file={{ label: null, value: null, file: null }}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
            inputProps={{
              accept: "image/*",
            }}
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
