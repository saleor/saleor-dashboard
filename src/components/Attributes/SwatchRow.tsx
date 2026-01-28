// @ts-strict-ignore
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { getErrorMessage, getSingleDisplayValue } from "@dashboard/components/Attributes/utils";
import useDebounce from "@dashboard/hooks/useDebounce";
import { commonMessages } from "@dashboard/intl";
import { getBySlug } from "@dashboard/misc";
import { Box, DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React, { useMemo, useRef } from "react";
import { useIntl } from "react-intl";

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
  const value = attribute.data.values.find(getBySlug(attribute.value[0]));

  const debouncedFetch = useDebounce((query: string) => {
    fetchAttributeValues(query, attribute.id);
  }, 500);

  const options = useMemo(
    () =>
      attributeValues.map(({ file, value, slug, name }) => ({
        label: name,
        value: slug,
        startAdornment: (
          <SwatchPreviewBox
            isFile={!!file}
            backgroundImageUrl={file?.url}
            backgroundColor={value}
          />
        ),
      })),
    [attributeValues],
  );

  const handleFocus = () => {
    if (!mounted.current) {
      mounted.current = true;
      fetchAttributeValues("", attribute.id);
    }
  };

  const handleScrollEnd = () => {
    if (fetchMoreAttributeValues?.hasMore) {
      fetchMoreAttributeValues.onFetchMore();
    }
  };

  const handleChange = (option: Option | null) => {
    onChange(attribute.id, option?.value ?? null);
  };

  return (
    <BasicAttributeRow label={attribute.label}>
      <DynamicCombobox
        disabled={disabled}
        options={options}
        value={
          attribute.value[0]
            ? {
                value: attribute.value[0],
                label: getSingleDisplayValue(attribute, attributeValues),
                startAdornment: value ? (
                  <SwatchPreviewBox
                    isFile={!!value?.file}
                    backgroundImageUrl={value?.file?.url}
                    backgroundColor={value?.value}
                  />
                ) : undefined,
              }
            : null
        }
        error={!!error}
        label=""
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        onChange={handleChange}
        onInputValueChange={debouncedFetch}
        onFocus={handleFocus}
        onScrollEnd={handleScrollEnd}
        loading={fetchMoreAttributeValues?.loading || fetchMoreAttributeValues?.hasMore}
        locale={{
          loadingText: intl.formatMessage(commonMessages.loading),
        }}
        size="small"
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
