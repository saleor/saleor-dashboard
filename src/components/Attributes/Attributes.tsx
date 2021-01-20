import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { AttributeReference } from "@saleor/attributes/utils/data";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { PageErrorWithAttributesFragment } from "@saleor/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { ReorderEvent } from "@saleor/types";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum
} from "@saleor/types/globalTypes";
import { getProductErrorMessage } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import classNames from "classnames";
import React from "react";
import {
  defineMessages,
  FormattedMessage,
  IntlShape,
  useIntl
} from "react-intl";

import FileUploadField, { FileChoiceType } from "../FileUploadField";
import SortableChipsField, {
  SortableChipsFieldValueType
} from "../SortableChipsField";
import BasicAttributeRow from "./BasicAttributeRow";
import ExtendedAttributeRow from "./ExtendedAttributeRow";
import { VariantAttributeScope } from "./types";

export interface AttributeInputData {
  inputType: AttributeInputTypeEnum;
  entityType?: AttributeEntityTypeEnum;
  variantAttributeScope?: VariantAttributeScope;
  isRequired: boolean;
  values: AttributeValueFragment[];
  selectedValues?: AttributeValueFragment[];
  references?: AttributeReference[];
}
export type AttributeInput = FormsetAtomicData<AttributeInputData, string[]>;
export type AttributeFileInput = FormsetAtomicData<AttributeInputData, File[]>;
export interface AttributesProps {
  attributes: AttributeInput[];
  disabled: boolean;
  loading: boolean;
  errors: Array<
    ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment
  >;
  title?: React.ReactNode;
  onChange: FormsetChange<string>;
  onMultiChange: FormsetChange<string>;
  onFileChange: FormsetChange<File>;
  onReferencesRemove: FormsetChange<string[]>;
  onReferencesAddClick: (attribute: AttributeInput) => void;
  onReferencesReorder: FormsetChange<ReorderEvent>;
}

const useStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0
      },
      padding: theme.spacing(2, 0)
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex"
    },
    card: {
      overflow: "visible"
    },
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(1)
      },
      paddingTop: theme.spacing(1)
    },
    expansionBar: {
      display: "flex"
    },
    expansionBarButton: {
      marginBottom: theme.spacing(1)
    },
    expansionBarButtonIcon: {
      transition: theme.transitions.duration.short + "ms"
    },
    expansionBarLabel: {
      color: theme.palette.text.disabled,
      fontSize: 14
    },
    expansionBarLabelContainer: {
      alignItems: "center",
      display: "flex",
      flex: 1
    },
    fileField: {
      float: "right"
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    uploadFileButton: {
      float: "right"
    },
    uploadFileContent: {
      color: theme.palette.primary.main,
      float: "right",
      fontSize: "1rem"
    }
  }),
  { name: "Attributes" }
);

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

const messages = defineMessages({
  attributesNumber: {
    defaultMessage: "{number} Attributes",
    description: "number of attributes"
  },
  header: {
    defaultMessage: "Attributes",
    description: "attributes, section header"
  },
  multipleValueLable: {
    defaultMessage: "Values",
    description: "attribute values"
  },
  valueLabel: {
    defaultMessage: "Value",
    description: "attribute value"
  }
});

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

const Attributes: React.FC<AttributesProps> = ({
  attributes,
  disabled,
  loading,
  errors,
  title,
  onChange,
  onMultiChange,
  onFileChange,
  onReferencesRemove,
  onReferencesAddClick,
  onReferencesReorder
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [expanded, setExpansionStatus] = React.useState(true);
  const toggleExpansion = () => setExpansionStatus(!expanded);

  return (
    <Card className={classes.card}>
      <CardTitle title={title || intl.formatMessage(messages.header)} />
      <CardContent className={classes.cardContent}>
        <div className={classes.expansionBar}>
          <div className={classes.expansionBarLabelContainer}>
            <Typography className={classes.expansionBarLabel} variant="caption">
              <FormattedMessage
                {...messages.attributesNumber}
                values={{
                  number: attributes.length
                }}
              />
            </Typography>
          </div>
          <IconButton
            className={classes.expansionBarButton}
            onClick={toggleExpansion}
            data-test="attributes-expand"
          >
            <ArrowDropDownIcon
              className={classNames(classes.expansionBarButtonIcon, {
                [classes.rotate]: expanded
              })}
            />
          </IconButton>
        </div>
        {expanded && attributes.length > 0 && (
          <>
            <Hr />
            {attributes.map((attribute, attributeIndex) => {
              const error = errors.find(err =>
                err.attributes?.includes(attribute.id)
              );

              return (
                <React.Fragment key={attribute.id}>
                  {attributeIndex > 0 && <Hr />}
                  {attribute.data.inputType ===
                  AttributeInputTypeEnum.REFERENCE ? (
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
                        onValueReorder={event =>
                          onReferencesReorder(attribute.id, event)
                        }
                        loading={loading}
                        error={!!error}
                        helperText={getErrorMessage(error, intl)}
                      />
                    </ExtendedAttributeRow>
                  ) : attribute.data.inputType ===
                    AttributeInputTypeEnum.FILE ? (
                    <BasicAttributeRow label={attribute.label}>
                      <FileUploadField
                        className={classes.fileField}
                        disabled={disabled}
                        loading={loading}
                        file={getFileChoice(attribute)}
                        onFileUpload={file => onFileChange(attribute.id, file)}
                        onFileDelete={() =>
                          onFileChange(attribute.id, undefined)
                        }
                        error={!!error}
                        helperText={getErrorMessage(error, intl)}
                        inputProps={{
                          name: `attribute:${attribute.label}`
                        }}
                      />
                    </BasicAttributeRow>
                  ) : attribute.data.inputType ===
                    AttributeInputTypeEnum.DROPDOWN ? (
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
                        onChange={event =>
                          onChange(attribute.id, event.target.value)
                        }
                        allowCustomValues={!attribute.data.isRequired}
                      />
                    </BasicAttributeRow>
                  ) : (
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
                        onChange={event =>
                          onMultiChange(attribute.id, event.target.value)
                        }
                        allowCustomValues={!attribute.data.isRequired}
                      />
                    </BasicAttributeRow>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
};
Attributes.displayName = "Attributes";
export default Attributes;
