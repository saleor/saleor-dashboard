// @ts-strict-ignore
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { getErrorMessage, getSingleDisplayValue } from "@dashboard/components/Attributes/utils";
import { getBySlug } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { Combobox } from "../Combobox";
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

export const SwatchRow = ({
  attributeValues,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  attribute,
  disabled,
  error,
  onChange,
}: SwatchRowProps) => {
  const intl = useIntl();
  const value = attribute.data.values.find(getBySlug(attribute.value[0]));
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

  return (
    <BasicAttributeRow label={attribute.label}>
      <Combobox
        disabled={disabled}
        options={options}
        value={
          attribute.value[0]
            ? {
                value: attribute.value[0],
                label: getSingleDisplayValue(attribute, attributeValues),
              }
            : null
        }
        startAdornment={() =>
          value ? (
            <SwatchPreviewBox
              isFile={!!value?.file}
              backgroundImageUrl={value?.file?.url}
              backgroundColor={value?.value}
            />
          ) : null
        }
        error={!!error}
        label=""
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        onChange={e => onChange(attribute.id, e.target.value)}
        fetchOptions={query => {
          fetchAttributeValues(query, attribute.id);
        }}
        fetchMore={fetchMoreAttributeValues}
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
