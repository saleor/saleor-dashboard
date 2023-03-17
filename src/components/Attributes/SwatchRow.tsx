import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getErrorMessage,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import SingleAutocompleteSelectField from "@dashboard/components/SingleAutocompleteSelectField";
import { getBySlug } from "@dashboard/misc";
import { InputAdornment } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";
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
  const classes = useStyles();
  const intl = useIntl();
  const value = attribute.data.values.find(getBySlug(attribute.value[0]));

  return (
    <BasicAttributeRow
      label={attribute.label}
      id={`attribute:${attribute.label}`}
    >
      <SingleAutocompleteSelectField
        fetchOnFocus
        allowCustomValues={false}
        choices={attributeValues.map(({ file, value, slug, name }) => ({
          label: (
            <>
              <div
                className={classes.swatchPreview}
                style={
                  file
                    ? { backgroundImage: `url(${file.url})` }
                    : { backgroundColor: value }
                }
              />
              <HorizontalSpacer />
              {name}
            </>
          ),
          value: slug,
        }))}
        disabled={disabled}
        displayValue={getSingleDisplayValue(attribute, attributeValues)}
        emptyOption={!attribute.data.isRequired}
        error={!!error}
        helperText={getErrorMessage(error, intl)}
        name={`attribute:${attribute.label}`}
        id={`attribute:${attribute.label}`}
        value={attribute.value[0]}
        onChange={event => onChange(attribute.id, event.target.value)}
        fetchChoices={value => fetchAttributeValues(value, attribute.id)}
        InputProps={{
          classes: { input: classes.swatchInput },
          startAdornment: (
            <InputAdornment position="start">
              <div
                className={classes.swatchPreview}
                style={
                  value?.file
                    ? { backgroundImage: `url(${value.file.url})` }
                    : { backgroundColor: value?.value }
                }
              />
            </InputAdornment>
          ),
        }}
        {...fetchMoreAttributeValues}
      />
    </BasicAttributeRow>
  );
};
