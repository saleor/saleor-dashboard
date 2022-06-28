import { InputAdornment, TextField } from "@material-ui/core";
import { getMeasurementUnitMessage } from "@saleor/attributes/components/AttributeDetails/utils";
import BasicAttributeRow from "@saleor/components/Attributes/BasicAttributeRow";
import ExtendedAttributeRow from "@saleor/components/Attributes/ExtendedAttributeRow";
import { attributeRowMessages } from "@saleor/components/Attributes/messages";
import { SwatchRow } from "@saleor/components/Attributes/SwatchRow";
import {
  getErrorMessage,
  getFileChoice,
  getMultiChoices,
  getMultiDisplayValue,
  getReferenceDisplayValue,
  getSingleChoices,
  getSingleDisplayValue,
} from "@saleor/components/Attributes/utils";
import Checkbox from "@saleor/components/Checkbox";
import { DateTimeField } from "@saleor/components/DateTimeField";
import FileUploadField from "@saleor/components/FileUploadField";
import MultiAutocompleteSelectField from "@saleor/components/MultiAutocompleteSelectField";
import RichTextEditor from "@saleor/components/RichTextEditor";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import SortableChipsField from "@saleor/components/SortableChipsField";
import { AttributeInputTypeEnum } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";
import { AttributeRowProps } from "./types";

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
  onAttributeSelectBlur,
  richTextGetters,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  switch (attribute.data.inputType) {
    case AttributeInputTypeEnum.REFERENCE:
      return (
        <ExtendedAttributeRow
          label={attribute.label}
          selectLabel={intl.formatMessage(attributeRowMessages.reference)}
          onSelect={() => onReferencesAddClick(attribute)}
          disabled={disabled}
        >
          <SortableChipsField
            values={getReferenceDisplayValue(attribute)}
            onValueDelete={value =>
              onReferencesRemove(
                attribute.id,
                attribute.value?.filter(id => id !== value),
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
              name: `attribute:${attribute.label}`,
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
            label={intl.formatMessage(attributeRowMessages.valueLabel)}
            value={attribute.value[0]}
            onChange={event => onChange(attribute.id, event.target.value)}
            allowCustomValues={true}
            fetchOnFocus={true}
            fetchChoices={value => fetchAttributeValues(value, attribute.id)}
            onBlur={onAttributeSelectBlur}
            {...fetchMoreAttributeValues}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.SWATCH:
      return (
        <SwatchRow
          attribute={attribute}
          attributeValues={attributeValues}
          onChange={onChange}
          disabled={disabled}
          error={error}
          fetchAttributeValues={fetchAttributeValues}
          fetchMoreAttributeValues={fetchMoreAttributeValues}
        />
      );
    case AttributeInputTypeEnum.PLAIN_TEXT:
      return (
        <BasicAttributeRow label={attribute.label}>
          <TextField
            fullWidth
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            label={intl.formatMessage(attributeRowMessages.valueLabel)}
            name={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="text"
            value={attribute.value[0]}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.RICH_TEXT:
      const {
        getShouldMount,
        getDefaultValue,
        getMountEditor,
        getHandleChange,
      } = richTextGetters;
      const defaultValue = getDefaultValue(attribute.id);
      return (
        <BasicAttributeRow label={attribute.label}>
          {getShouldMount(attribute.id) && (
            <RichTextEditor
              defaultValue={defaultValue}
              editorRef={getMountEditor(attribute.id)}
              onChange={getHandleChange(attribute.id)}
              name={`attribute:${attribute.label}`}
              disabled={disabled}
              error={!!error}
              label={intl.formatMessage(attributeRowMessages.valueLabel)}
              helperText={getErrorMessage(error, intl)}
            />
          )}
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
            label={intl.formatMessage(attributeRowMessages.valueLabel)}
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
                      intl.formatMessage,
                    )}
                  </InputAdornment>
                ),
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
    case AttributeInputTypeEnum.DATE:
      return (
        <BasicAttributeRow label={attribute.label} flexValueContainer>
          <TextField
            fullWidth
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            label={intl.formatMessage(commonMessages.date)}
            name={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="date"
            value={attribute.value[0]}
            InputLabelProps={{ shrink: true }}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.DATE_TIME:
      return (
        <BasicAttributeRow label={attribute.label} flexValueContainer>
          <DateTimeField
            fullWidth
            name={`attribute:${attribute.label}`}
            disabled={disabled}
            error={error}
            value={attribute.value[0]}
            helperText={getErrorMessage(error, intl)}
            onChange={value => onChange(attribute.id, value)}
          />
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
            label={intl.formatMessage(attributeRowMessages.multipleValueLabel)}
            name={`attribute:${attribute.label}`}
            value={attribute.value}
            onChange={event => onMultiChange(attribute.id, event.target.value)}
            allowCustomValues={true}
            fetchOnFocus={true}
            fetchChoices={value => fetchAttributeValues(value, attribute.id)}
            onBlur={onAttributeSelectBlur}
            {...fetchMoreAttributeValues}
          />
        </BasicAttributeRow>
      );
  }
};
AttributeRow.displayName = "AttributeRow";
export default AttributeRow;
