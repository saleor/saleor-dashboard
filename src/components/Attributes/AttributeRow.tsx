import { InputAdornment, TextField } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { getMeasurementUnitMessage } from "@saleor/attributes/components/AttributeDetails/utils";
import { AttributeInput } from "@saleor/components/Attributes/Attributes";
import BasicAttributeRow from "@saleor/components/Attributes/BasicAttributeRow";
import ExtendedAttributeRow from "@saleor/components/Attributes/ExtendedAttributeRow";
import {
  getErrorMessage,
  getFileChoice,
  getMultiChoices,
  getMultiDisplayValue,
  getReferenceDisplayValue,
  getRichTextData,
  getSingleChoices,
  getSingleDisplayValue
} from "@saleor/components/Attributes/utils";
import Checkbox from "@saleor/components/Checkbox";
import FileUploadField from "@saleor/components/FileUploadField";
import MultiAutocompleteSelectField from "@saleor/components/MultiAutocompleteSelectField";
import RichTextEditor from "@saleor/components/RichTextEditor";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import SortableChipsField from "@saleor/components/SortableChipsField";
import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  multipleValueLabel: {
    defaultMessage: "Values",
    description: "attribute values"
  },
  valueLabel: {
    defaultMessage: "Value",
    description: "attribute value"
  }
});

const useStyles = makeStyles(
  () => ({
    fileField: {
      float: "right"
    },
    pullRight: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }),
  { name: "AttributeRow" }
);

export interface AttributeRowHandlers {
  onChange: FormsetChange<string>;
  onFileChange: FormsetChange<File>;
  onMultiChange: FormsetChange<string>;
  onReferencesAddClick: (attribute: AttributeInput) => void;
  onReferencesRemove: FormsetChange<string[]>;
  onReferencesReorder: FormsetChange<ReorderEvent>;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues: FetchMoreProps;
}

interface AttributeRowProps extends AttributeRowHandlers {
  attribute: AttributeInput;
  attributeValues: AttributeValueFragment[];
  disabled: boolean;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  loading: boolean;
  entityId: string;
}

const AttributeRow: React.FC<AttributeRowProps> = ({
  attribute,
  attributeValues,
  disabled,
  error,
  loading,
  onFileChange,
  onMultiChange,
  onReferencesAddClick,
  onReferencesRemove,
  onReferencesReorder,
  onChange,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  entityId
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  switch (attribute.data.inputType) {
    case AttributeInputTypeEnum.REFERENCE:
      return (
        <ExtendedAttributeRow
          label={attribute.label}
          selectLabel={intl.formatMessage({
            defaultMessage: "Assign references",
            description: "button label"
          })}
          onSelect={() => onReferencesAddClick(attribute)}
          disabled={disabled}
        >
          <SortableChipsField
            values={getReferenceDisplayValue(attribute)}
            onValueDelete={value =>
              onReferencesRemove(
                attribute.id,
                attribute.value?.filter(id => id !== value)
              )
            }
            onValueReorder={event => onReferencesReorder(attribute.id, event)}
            loading={loading}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
          />
        </ExtendedAttributeRow>
      );
    case AttributeInputTypeEnum.FILE:
      return (
        <BasicAttributeRow label={attribute.label}>
          <FileUploadField
            className={classes.fileField}
            disabled={disabled}
            loading={loading}
            file={getFileChoice(attribute)}
            onFileUpload={file => onFileChange(attribute.id, file)}
            onFileDelete={() => onFileChange(attribute.id, undefined)}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            inputProps={{
              name: `attribute:${attribute.label}`
            }}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.DROPDOWN:
      return (
        <BasicAttributeRow label={attribute.label}>
          <SingleAutocompleteSelectField
            choices={getSingleChoices(attributeValues)}
            disabled={disabled}
            displayValue={getSingleDisplayValue(attribute, attributeValues)}
            emptyOption={!attribute.data.isRequired}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            name={`attribute:${attribute.label}`}
            label={intl.formatMessage(messages.valueLabel)}
            value={attribute.value[0]}
            onChange={event => onChange(attribute.id, event.target.value)}
            allowCustomValues={true}
            fetchOnFocus={true}
            fetchChoices={value => fetchAttributeValues(value, attribute.id)}
            {...fetchMoreAttributeValues}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.RICH_TEXT:
      return (
        <BasicAttributeRow label={attribute.label}>
          <RichTextEditor
            key={entityId} // temporary workaround, TODO: refactor rich text editor
            name={`attribute:${attribute.label}`}
            disabled={disabled}
            error={!!error}
            label={intl.formatMessage(messages.valueLabel)}
            helperText={getErrorMessage(error, intl)}
            onChange={data => onChange(attribute.id, JSON.stringify(data))}
            data={getRichTextData(attribute)}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.NUMERIC:
      return (
        <BasicAttributeRow label={attribute.label}>
          <TextField
            fullWidth
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            label={intl.formatMessage(messages.valueLabel)}
            name={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="number"
            value={attribute.value[0]}
            InputProps={
              attribute.data.unit && {
                endAdornment: (
                  <InputAdornment position="end">
                    {getMeasurementUnitMessage(
                      attribute.data.unit,
                      intl.formatMessage
                    )}
                  </InputAdornment>
                )
              }
            }
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.BOOLEAN:
      return (
        <BasicAttributeRow label={attribute.label}>
          <div className={classes.pullRight}>
            <Checkbox
              disabled={disabled}
              name={`attribute:${attribute.label}`}
              onChange={event =>
                onChange(attribute.id, JSON.stringify(event.target.checked))
              }
              checked={JSON.parse(attribute.value[0] ?? "false")}
              className={classes.pullRight}
              helperText={getErrorMessage(error, intl)}
              error={!!error}
            />
          </div>
        </BasicAttributeRow>
      );
    default:
      return (
        <BasicAttributeRow label={attribute.label}>
          <MultiAutocompleteSelectField
            choices={getMultiChoices(attributeValues)}
            displayValues={getMultiDisplayValue(attribute, attributeValues)}
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            label={intl.formatMessage(messages.multipleValueLabel)}
            name={`attribute:${attribute.label}`}
            value={attribute.value}
            onChange={event => onMultiChange(attribute.id, event.target.value)}
            allowCustomValues={true}
            fetchOnFocus={true}
            fetchChoices={value => fetchAttributeValues(value, attribute.id)}
            {...fetchMoreAttributeValues}
          />
        </BasicAttributeRow>
      );
  }
};
AttributeRow.displayName = "AttributeRow";
export default AttributeRow;
