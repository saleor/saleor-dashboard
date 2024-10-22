import { inputTypeMessages } from "@dashboard/attributes/components/AttributeDetails/messages";
import { AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { ColorPicker, ColorPickerProps } from "@dashboard/components/ColorPicker";
import FileUploadField from "@dashboard/components/FileUploadField";
import { SimpleRadioGroupField } from "@dashboard/components/SimpleRadioGroupField";
import { useFileUploadMutation } from "@dashboard/graphql";
import { UseFormResult } from "@dashboard/hooks/useForm";
import useNotifier from "@dashboard/hooks/useNotifier";
import { errorMessages } from "@dashboard/intl";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { swatchFieldMessages } from "./messages";

type AttributeSwatchFieldProps<T> = Pick<
  UseFormResult<T>,
  "setError" | "set" | "errors" | "clearErrors" | "data"
>;

type SwatchType = "picker" | "image";

export const useFileProcessing = ({
  set,
}: {
  set: (data: Partial<AttributeValueEditDialogFormData>) => void;
}) => {
  const notify = useNotifier();
  const intl = useIntl();
  const [processing, setProcessing] = useState(false);

  const [uploadFile] = useFileUploadMutation({});

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
  };

  const handleFileDelete = () => {
    set({
      fileUrl: undefined,
      contentType: undefined,
      value: undefined,
    });
  };

  const handleOnload = () => {
    setProcessing(false);
  };

  return {
    processing,
    handleFileUpload,
    handleFileDelete,
    handleOnload,
  };
};

const useColorProcessing = ({
  set,
}: {
  set: (data: Partial<AttributeValueEditDialogFormData>) => void;
}) => {
  const handleColorChange = (hex: string) =>
    set({ value: hex, fileUrl: undefined, contentType: undefined });

  return { handleColorChange };
};

const AttributeSwatchField: React.FC<
  AttributeSwatchFieldProps<AttributeValueEditDialogFormData>
> = ({ set, ...props }) => {
  const { data } = props;
  const { formatMessage } = useIntl();
  const [type, setType] = useState<SwatchType>(data.fileUrl ? "image" : "picker");
  const { handleFileUpload, handleFileDelete, handleOnload, processing } = useFileProcessing({
    set,
  });
  const { handleColorChange } = useColorProcessing({ set });

  return (
    <>
      <SimpleRadioGroupField
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
        label={<FormattedMessage {...inputTypeMessages.swatch} />}
        name="swatch"
        value={type}
        onChange={event => setType(event.target.value)}
        display="flex"
        paddingTop={3}
        gap={4}
        data-test-id="swatch-radio"
      />
      <Box __height={280} overflow="hidden">
        {type === "image" ? (
          <>
            <Box paddingBottom={4}>
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
            </Box>
            <Box
              width="100%"
              marginX="auto"
              position="relative"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {data.fileUrl && (
                <Box
                  display={processing ? "none" : "block"}
                  as="img"
                  src={data.fileUrl}
                  __width="216px"
                  __height="216px"
                  objectFit="cover"
                  onLoad={handleOnload}
                />
              )}
              {processing && <Skeleton __width="216px" __height="216px" />}
            </Box>
          </>
        ) : (
          <ColorPicker {...(props as ColorPickerProps)} onColorChange={handleColorChange} />
        )}
      </Box>
    </>
  );
};

AttributeSwatchField.displayName = "AttributeSwatchField";
export default AttributeSwatchField;
