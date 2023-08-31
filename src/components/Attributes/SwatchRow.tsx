// @ts-strict-ignore
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getErrorMessage,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import useDebounce from "@dashboard/hooks/useDebounce";
import { getBySlug } from "@dashboard/misc";
import { Box, DynamicCombobox } from "@saleor/macaw-ui/next";
import React, { useRef, useState } from "react";
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
  const mounted = useRef(false);
  const inputValue = useRef("");

  const value = attribute.data.values.find(getBySlug(attribute.value[0]));

  const [selectedValue, setSelectedValue] = useState(
    attribute.value[0]
      ? {
          label: getSingleDisplayValue(attribute, attributeValues),
          value: attribute.value[0],
          startAdornment: null,
        }
      : null,
  );

  const debouncedFetchAttributeValues = useRef(
    useDebounce(async (value: string) => {
      fetchAttributeValues(value, attribute.id);
    }, 500),
  ).current;

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
            <SwatchPreviewBox
              isFile={!!file}
              backgroundImageUrl={file?.url}
              backgroundColor={value}
            />
          ),
        }))}
        value={selectedValue}
        startAdornment={() =>
          selectedValue ? (
            <SwatchPreviewBox
              isFile={!!value?.file}
              backgroundImageUrl={value?.file?.url}
              backgroundColor={value?.value}
            />
          ) : null
        }
        error={!!error}
        label={intl.formatMessage(attributeRowMessages.valueLabel)}
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        onChange={value => {
          setSelectedValue(value);
          onChange(attribute.id, value?.value);
        }}
        onInputValueChange={value => {
          inputValue.current = value;
          debouncedFetchAttributeValues(value);
        }}
        onFocus={() => {
          if (!mounted.current) {
            fetchAttributeValues("", attribute.id);
          }
        }}
        loading={fetchMoreAttributeValues.loading}
        locale={{
          loadingText: "Loading...",
        }}
      />
    </BasicAttributeRow>
  );
};

const SwatchPreviewBox = ({
  isFile,
  backgroundColor,
  backgroundImageUrl,
}: {
  isFile: boolean;
  backgroundImageUrl?: string;
  backgroundColor?: string;
}) => {
  return (
    <Box
      width={8}
      height={8}
      borderRadius={2}
      marginRight={2}
      style={{
        ...(isFile
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor }),
      }}
    />
  );
};
