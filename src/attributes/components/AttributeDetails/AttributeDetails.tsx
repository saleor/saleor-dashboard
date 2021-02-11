import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { commonMessages } from "@saleor/intl";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getAttributeErrorMessage from "@saleor/utils/errors/attribute";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import slugify from "slugify";

import { getAttributeSlugErrorMessage } from "../../errors";
import { AttributePageFormData } from "../AttributePage";

const messages = defineMessages({
  attributeLabel: {
    defaultMessage: "Default Label",
    description: "attribute's label"
  },
  attributeSlug: {
    defaultMessage: "Attribute Code",
    description: "attribute's slug short code label"
  },
  attributeSlugHelperText: {
    defaultMessage: "This is used internally. Make sure you don’t use spaces",
    description: "attribute slug input field helper text"
  },
  entityType: {
    defaultMessage: "Entity",
    description: "attribute's editor component entity"
  },
  inputType: {
    defaultMessage: "Catalog Input type for Store Owner",
    description: "attribute's editor component"
  },
  valueRequired: {
    defaultMessage: "Value Required",
    description: "check to require attribute to have value"
  }
});

const inputTypeMessages = defineMessages({
  dropdown: {
    defaultMessage: "Dropdown",
    description: "product attribute type"
  },
  file: {
    defaultMessage: "File",
    description: "file attribute type"
  },
  multiselect: {
    defaultMessage: "Multiple Select",
    description: "product attribute type"
  },
  references: {
    defaultMessage: "References",
    description: "references attribute type"
  }
});

const entityTypeMessages = defineMessages({
  page: {
    defaultMessage: "Pages",
    description: "page attribute entity type"
  },
  product: {
    defaultMessage: "Products",
    description: "product attribute entity type"
  }
});

const useStyles = makeStyles(
  theme => ({
    inputTypeSection: {
      columnGap: theme.spacing(2) + "px",
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexFlow: "wrap",
        rowGap: theme.spacing(3) + "px"
      }
    }
  }),
  { name: "AttributeDetails" }
);

export interface AttributeDetailsProps {
  canChangeType: boolean;
  data: AttributePageFormData;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = props => {
  const { canChangeType, data, disabled, errors, onChange } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const inputTypeChoices = [
    {
      label: intl.formatMessage(inputTypeMessages.dropdown),
      value: AttributeInputTypeEnum.DROPDOWN
    },
    {
      label: intl.formatMessage(inputTypeMessages.multiselect),
      value: AttributeInputTypeEnum.MULTISELECT
    },
    {
      label: intl.formatMessage(inputTypeMessages.file),
      value: AttributeInputTypeEnum.FILE
    },
    {
      label: intl.formatMessage(inputTypeMessages.references),
      value: AttributeInputTypeEnum.REFERENCE
    }
  ];
  const entityTypeChoices = [
    {
      label: intl.formatMessage(entityTypeMessages.page),
      value: AttributeEntityTypeEnum.PAGE
    },
    {
      label: intl.formatMessage(entityTypeMessages.product),
      value: AttributeEntityTypeEnum.PRODUCT
    }
  ];

  const formErrors = getFormErrors(
    ["name", "slug", "inputType", "entityType"],
    errors
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          label={intl.formatMessage(messages.attributeLabel)}
          name={"name" as keyof AttributePageFormData}
          fullWidth
          helperText={getAttributeErrorMessage(formErrors.name, intl)}
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.slug}
          label={intl.formatMessage(messages.attributeSlug)}
          name={"slug" as keyof AttributePageFormData}
          placeholder={slugify(data.name).toLowerCase()}
          fullWidth
          helperText={
            getAttributeSlugErrorMessage(formErrors.slug, intl) ||
            intl.formatMessage(messages.attributeSlugHelperText)
          }
          value={data.slug}
          onChange={onChange}
        />
        <FormSpacer />
        <div className={classes.inputTypeSection}>
          <SingleSelectField
            choices={inputTypeChoices}
            disabled={disabled || !canChangeType}
            error={!!formErrors.inputType}
            hint={getAttributeErrorMessage(formErrors.inputType, intl)}
            label={intl.formatMessage(messages.inputType)}
            name="inputType"
            onChange={onChange}
            value={data.inputType}
          />
          {data.inputType === AttributeInputTypeEnum.REFERENCE && (
            <SingleSelectField
              choices={entityTypeChoices}
              disabled={disabled || !canChangeType}
              error={!!formErrors.entityType}
              hint={getAttributeErrorMessage(formErrors.entityType, intl)}
              label={intl.formatMessage(messages.entityType)}
              name="entityType"
              onChange={onChange}
              value={data.entityType}
            />
          )}
        </div>
        <FormSpacer />
        <ControlledCheckbox
          name={"valueRequired" as keyof AttributePageFormData}
          label={intl.formatMessage(messages.valueRequired)}
          checked={data.valueRequired}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
AttributeDetails.displayName = "AttributeDetails";
export default AttributeDetails;
