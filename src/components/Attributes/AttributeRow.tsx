import makeStyles from "@material-ui/core/styles/makeStyles";
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
  getSingleChoices
} from "@saleor/components/Attributes/utils";
import FileUploadField from "@saleor/components/FileUploadField";
import MultiAutocompleteSelectField from "@saleor/components/MultiAutocompleteSelectField";
import RichTextEditor from "@saleor/components/RichTextEditor";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import SortableChipsField from "@saleor/components/SortableChipsField";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { ReorderEvent } from "@saleor/types";
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
}

interface AttributeRowProps extends AttributeRowHandlers {
  attribute: AttributeInput;
  disabled: boolean;
  error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
  loading: boolean;
}

const AttributeRow: React.FC<AttributeRowProps> = ({
  attribute,
  disabled,
  error,
  loading,
  onFileChange,
  onMultiChange,
  onReferencesAddClick,
  onReferencesRemove,
  onReferencesReorder,
  onChange
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
            choices={getSingleChoices(attribute.data.values)}
            disabled={disabled}
            displayValue={
              attribute.data.values.find(
                value => value.slug === attribute.value[0]
              )?.name ||
              attribute.value[0] ||
              ""
            }
            emptyOption={!attribute.data.isRequired}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            name={`attribute:${attribute.label}`}
            label={intl.formatMessage(messages.valueLabel)}
            value={attribute.value[0]}
            onChange={event => onChange(attribute.id, event.target.value)}
            allowCustomValues={!attribute.data.isRequired}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.RICH_TEXT:
      return (
        <BasicAttributeRow label={attribute.label}>
          <RichTextEditor
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
    default:
      return (
        <BasicAttributeRow label={attribute.label}>
          <MultiAutocompleteSelectField
            choices={getMultiChoices(attribute.data.values)}
            displayValues={getMultiDisplayValue(attribute)}
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            label={intl.formatMessage(messages.multipleValueLabel)}
            name={`attribute:${attribute.label}`}
            value={attribute.value}
            onChange={event => onMultiChange(attribute.id, event.target.value)}
            allowCustomValues={!attribute.data.isRequired}
          />
        </BasicAttributeRow>
      );
  }
};
AttributeRow.displayName = "AttributeRow";
export default AttributeRow;
