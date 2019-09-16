import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "@saleor/types";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import { AttributePageFormData } from "../AttributePage";

export interface AttributeDetailsProps {
  canChangeType: boolean;
  data: AttributePageFormData;
  disabled: boolean;
  errors: FormErrors<"name" | "slug" | "inputType">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = ({
  canChangeType,
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();
  const inputTypeChoices = [
    {
      label: intl.formatMessage({
        defaultMessage: "Dropdown",
        description: "product attribute type"
      }),
      value: AttributeInputTypeEnum.DROPDOWN
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Multiple Select",
        description: "product attribute type"
      }),
      value: AttributeInputTypeEnum.MULTISELECT
    }
  ];

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!errors.name}
          label={intl.formatMessage({
            defaultMessage: "Default Label",
            description: "attribute's label"
          })}
          name={"name" as keyof AttributePageFormData}
          fullWidth
          helperText={errors.name}
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.slug}
          label={intl.formatMessage({
            defaultMessage: "Attribute Code",
            description: "attribute's slug short code label"
          })}
          name={"slug" as keyof AttributePageFormData}
          placeholder={slugify(data.name).toLowerCase()}
          fullWidth
          helperText={
            errors.slug ||
            intl.formatMessage({
              defaultMessage:
                "This is used internally. Make sure you don’t use spaces",
              description: "attribute slug input field helper text"
            })
          }
          value={data.slug}
          onChange={onChange}
        />
        <FormSpacer />
        <SingleSelectField
          choices={inputTypeChoices}
          disabled={disabled || !canChangeType}
          error={!!errors.inputType}
          hint={errors.inputType}
          label={intl.formatMessage({
            defaultMessage: "Catalog Input type for Store Owner",
            description: "attribute's editor component"
          })}
          name="inputType"
          onChange={onChange}
          value={data.inputType}
        />
        <FormSpacer />
        <ControlledCheckbox
          name={"valueRequired" as keyof AttributePageFormData}
          label={intl.formatMessage({
            defaultMessage: "Value Required",
            description: "check to require attribute to have value"
          })}
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
