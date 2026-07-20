import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { DatagridSwatchPreview } from "@dashboard/components/Attributes/DatagridSwatchPreview";
import { getAttributeSwatchData } from "@dashboard/components/Attributes/getAttributeSwatchData";
import {
  getAttributeRowLabelProps,
  getErrorMessage,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import { useComboboxHandlers } from "@dashboard/components/Combobox/hooks/useComboboxHandlers";
import { DynamicCombobox } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { type AttributeRowProps } from "./types";

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
}: SwatchRowProps): JSX.Element => {
  const intl = useIntl();
  const selectedValueSlug = attribute.value[0];
  const value = selectedValueSlug
    ? attribute.data.values.find(attributeValue => attributeValue.slug === selectedValueSlug)
    : undefined;
  const selectedSwatch = getAttributeSwatchData(value);

  const { handleFetchMore, handleFocus, handleInputChange } = useComboboxHandlers({
    fetchOptions: query => fetchAttributeValues(query, attribute.id),
    alwaysFetchOnFocus: false,
    fetchMore: fetchMoreAttributeValues,
  });

  const options = useMemo(
    () =>
      attributeValues.flatMap(attributeValue => {
        if (!attributeValue.name || !attributeValue.slug) {
          return [];
        }

        const swatch = getAttributeSwatchData(attributeValue);

        return [
          {
            label: attributeValue.name,
            value: attributeValue.slug,
            startAdornment: swatch ? <DatagridSwatchPreview {...swatch} /> : null,
          },
        ];
      }),
    [attributeValues],
  );

  return (
    <BasicAttributeRow label={attribute.label} {...getAttributeRowLabelProps(attribute)}>
      <DynamicCombobox
        disabled={disabled}
        options={options}
        value={
          attribute.value[0]
            ? {
                value: attribute.value[0],
                label: getSingleDisplayValue(attribute, attributeValues),
                startAdornment: null,
              }
            : null
        }
        startAdornment={() =>
          selectedSwatch ? <DatagridSwatchPreview {...selectedSwatch} placement="input" /> : null
        }
        error={!!error}
        label=""
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        onChange={e => onChange(attribute.id, e?.value ?? "")}
        onInputValueChange={handleInputChange}
        onFocus={handleFocus}
        onScrollEnd={handleFetchMore}
        loading={fetchMoreAttributeValues?.hasMore || fetchMoreAttributeValues?.loading}
      />
    </BasicAttributeRow>
  );
};
