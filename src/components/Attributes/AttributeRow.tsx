import { TextField } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { AttributeInput } from "@saleor/components/Attributes/Attributes";
import BasicAttributeRow from "@saleor/components/Attributes/BasicAttributeRow";
import ExtendedAttributeRow from "@saleor/components/Attributes/ExtendedAttributeRow";
import FileUploadField, {
  FileChoiceType
} from "@saleor/components/FileUploadField";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import SortableChipsField, {
  SortableChipsFieldValueType
} from "@saleor/components/SortableChipsField";
import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { ReorderEvent } from "@saleor/types";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import { getProductErrorMessage } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import React from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";

function getSingleChoices(
  values: AttributeValueFragment[]
): SingleAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug
  }));
}

function getFileChoice(attribute: AttributeInput): FileChoiceType {
  const attributeValue = attribute.value?.length > 0 && attribute.value[0];

  const definedAttributeValue = attribute.data.values.find(
    definedValue => definedValue.slug === attributeValue
  );

  if (definedAttributeValue) {
    return {
      file: definedAttributeValue.file,
      label: definedAttributeValue.name,
      value: definedAttributeValue.slug
    };
  }

  return {
    label: attributeValue,
    value: attributeValue
  };
}

function getReferenceDisplayValue(
  attribute: AttributeInput
): SortableChipsFieldValueType[] {
  if (!attribute.value) {
    return [];
  }

  return attribute.value.map(attributeValue => {
    const definedAttributeValue = attribute.data.values.find(
      definedValue => definedValue.reference === attributeValue
    );
    // If value has been previously assigned, use it's data
    if (!!definedAttributeValue) {
      return {
        label: definedAttributeValue.name,
        value: definedAttributeValue.reference
      };
    }

    const definedAttributeReference = attribute.data.references?.find(
      reference => reference.value === attributeValue
    );
    // If value has not been yet assigned, use data of reference
    if (!!definedAttributeReference) {
      return definedAttributeReference;
    }

    return {
      label: attributeValue,
      value: attributeValue
    };
  });
}

function getMultiChoices(
  values: AttributeValueFragment[]
): MultiAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug
  }));
}

function getMultiDisplayValue(
  attribute: AttributeInput
): MultiAutocompleteChoiceType[] {
  if (!attribute.value) {
    return [];
  }

  return attribute.value.map(attributeValue => {
    const definedAttributeValue = attribute.data.values.find(
      definedValue => definedValue.slug === attributeValue
    );
    if (!!definedAttributeValue) {
      return {
        label: definedAttributeValue.name,
        value: definedAttributeValue.slug
      };
    }

    return {
      label: attributeValue,
      value: attributeValue
    };
  });
}

function getErrorMessage(
  err: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment,
  intl: IntlShape
): string {
  switch (err?.__typename) {
    case "ProductError":
      return getProductErrorMessage(err, intl);
    case "PageError":
      return getPageErrorMessage(err, intl);
  }
}

const messages = defineMessages({
  multipleValueLable: {
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
    case AttributeInputTypeEnum.TEXT:
      return (
        <BasicAttributeRow label={attribute.label}>
          <TextField
            fullWidth
            disabled={disabled}
            error={!!error}
            label={intl.formatMessage(messages.valueLabel)}
            value={attribute.value[0]}
            helperText={getErrorMessage(error, intl)}
            onChange={event => onChange(attribute.id, event.target.value)}
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
            label={intl.formatMessage(messages.multipleValueLable)}
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
