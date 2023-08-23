// @ts-strict-ignore
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getErrorMessage,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import { getBySlug } from "@dashboard/misc";
import { Box, DynamicCombobox } from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React from "react";
import { useIntl } from "react-intl";

import { attributeRowMessages } from "./messages";
import { AttributeRowProps } from "./types";

type SwatchRowProps = Pick<
  AttributeRowProps,
  | "attribute"
  | "attributeValues"
  | "disabled"
  | "error"
  | "onChange"
  | "fetchAttributeValues"
  | "fetchMoreAttributeValues"
>;

const ColorBox = (
  props:
    | { isFile: true; backgroundImageUrl: string }
    | {
        isFile: false;
        backgroundColor: string;
      },
) => {
  return (
    <Box
      width={8}
      height={8}
      borderRadius={2}
      marginRight={2}
      style={{
        ...(props.isFile
          ? {
              backgroundImage: `url(${props.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        ...(props.isFile === false
          ? { backgroundColor: props.backgroundColor }
          : {}),
      }}
    />
  );
};

export const SwatchRow: React.FC<SwatchRowProps> = ({
  attributeValues,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  attribute,
  disabled,
  error,
  onChange,
}) => {
  const intl = useIntl();
  const value = attribute.data.values.find(getBySlug(attribute.value[0]));

  const debouncedFetchAttributeValues = debounce((inputValue: string) => {
    if (!inputValue) {
      onChange(attribute.id, null);
      fetchAttributeValues("", attribute.id);
      return;
    }

    fetchAttributeValues(inputValue, attribute.id);
  }, 600);

  return (
    <BasicAttributeRow
      label={attribute.label}
      id={`attribute:${attribute.label}`}
    >
      <DynamicCombobox
        disabled={disabled}
        options={attributeValues.map(({ file, value, slug, name }) => ({
          label: name,
          value: slug,
          startAdornment: (
            <ColorBox
              isFile={!!file}
              backgroundImageUrl={file?.url}
              backgroundColor={value}
            />
          ),
        }))}
        value={
          attribute.value[0]
            ? {
                label: getSingleDisplayValue(attribute, attributeValues),
                value: attribute.value[0],
                startAdornment: null,
              }
            : null
        }
        startAdornment={() => (
          <ColorBox
            isFile={!!value?.file}
            backgroundImageUrl={value?.file?.url}
            backgroundColor={value?.value}
          />
        )}
        error={!!error}
        label={intl.formatMessage(attributeRowMessages.valueLabel)}
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        onChange={value => onChange(attribute.id, value?.value)}
        onInputValueChange={debouncedFetchAttributeValues}
        onFocus={() => {
          fetchAttributeValues("", attribute.id);
        }}
        loading={fetchMoreAttributeValues.loading}
        locale={{
          loadingText: "Loading...",
        }}
      />
    </BasicAttributeRow>
  );
};
