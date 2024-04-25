import { inputTypeMessages } from "@dashboard/attributes/components/AttributeDetails/messages";
import { AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { ColorPicker, ColorPickerProps } from "@dashboard/components/ColorPicker";
import FileUploadField from "@dashboard/components/FileUploadField";
import { RadioGroupField } from "@dashboard/components/RadioGroupField";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { useFileUploadMutation } from "@dashboard/graphql";
import { UseFormResult } from "@dashboard/hooks/useForm";
import useNotifier from "@dashboard/hooks/useNotifier";
import { errorMessages } from "@dashboard/intl";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { swatchFieldMessages } from "./messages";
import { useStyles } from "./styles";

type AttributeSwatchFieldProps<T> = Pick<
  UseFormResult<T>,
  "setError" | "set" | "errors" | "clearErrors" | "data"
>;

type SwatchType = "picker" | "image";

const AttributeSwatchField: React.FC<
  AttributeSwatchFieldProps<AttributeValueEditDialogFormData>
> = ({ set, ...props }) => {
  const { data } = props;
  const notify = useNotifier();
  const intl = useIntl();
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const [uploadFile] = useFileUploadMutation({});
  const [type, setType] = useState<SwatchType>(data.fileUrl ? "image" : "picker");
  const handleColorChange = (hex: string) =>
    set({ value: hex, fileUrl: undefined, contentType: undefined });
  const handleFileUpload = async (file: File) => {
    setProcessing(true);

    const { data } = await uploadFile({ variables: { file } });

    if (data?.fileUpload?.errors?.length) {
      notify({
        status: "error",
        title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
        text: intl.formatMessage(errorMessages.imageUploadErrorText),
      });
    } else {
      set({
        fileUrl: data?.fileUpload?.uploadedFile?.url,
        contentType: data?.fileUpload?.uploadedFile?.contentType ?? "",
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
            file={{ label: "", value: "", file: undefined }}
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
        <ColorPicker {...(props as ColorPickerProps)} onColorChange={handleColorChange} />
      )}
    </>
  );
};

AttributeSwatchField.displayName = "AttributeSwatchField";
export default AttributeSwatchField;
