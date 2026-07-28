import { inputTypeMessages } from "@dashboard/attributes/components/AttributeDetails/messages";
import { SwatchPreview } from "@dashboard/attributes/components/SwatchPreview/SwatchPreview";
import { type AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { ColorPicker, type ColorPickerProps } from "@dashboard/components/ColorPicker";
import FileUploadField from "@dashboard/components/FileUploadField";
import { SimpleRadioGroupField } from "@dashboard/components/SimpleRadioGroupField";
import { type UseFormResult } from "@dashboard/hooks/useForm";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { swatchFieldMessages } from "./messages";
import { useColorProcessing } from "./useColorProcessing";
import { useFileProcessing } from "./useFileProcessing";

type AttributeSwatchFieldProps<T> = Pick<
  UseFormResult<T>,
  "setError" | "set" | "errors" | "clearErrors" | "data"
> & {
  hidePreview?: boolean;
};

type SwatchType = "picker" | "image";

const AttributeSwatchField = ({
  hidePreview = false,
  set,
  ...props
}: AttributeSwatchFieldProps<AttributeValueEditDialogFormData>) => {
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
        label={<FormattedMessage {...inputTypeMessages.swatchType} />}
        name="swatch"
        value={type}
        onChange={event => setType(event.target.value)}
        display="flex"
        paddingTop={3}
        gap={4}
        data-test-id="swatch-radio"
      />
      <Box overflowX="auto" overflowY="hidden" width="100%">
        {type === "image" ? (
          <>
            <Box display="flex" alignItems="center" gap={3} paddingBottom={4}>
              {hidePreview ? null : <SwatchPreview imageUrl={data.fileUrl} size={40} />}
              <Box flexGrow="1" __minWidth={0}>
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
          <Box display="flex" alignItems="flex-start" gap={4}>
            {hidePreview ? null : (
              <Box paddingTop={2}>
                <SwatchPreview color={data.value} size={40} />
              </Box>
            )}
            <Box flexGrow="1" __minWidth={0}>
              <ColorPicker {...(props as ColorPickerProps)} onColorChange={handleColorChange} />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

AttributeSwatchField.displayName = "AttributeSwatchField";
export default AttributeSwatchField;
