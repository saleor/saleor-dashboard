import { NumericUnits } from "@dashboard/attributes/components/AttributeDetails/NumericUnits";
import { DashboardCard } from "@dashboard/components/Card";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import FormSpacer from "@dashboard/components/FormSpacer";
import { Select } from "@dashboard/components/Select";
import {
  AttributeEntityTypeEnum,
  AttributeErrorFragment,
  AttributeInputTypeEnum,
} from "@dashboard/graphql";
import { ChangeEvent, UseFormResult } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import { TextField } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import slugify from "slugify";

import { getAttributeSlugErrorMessage } from "../../errors";
import { AttributePageFormData } from "../AttributePage";
import { inputTypeMessages, messages } from "./messages";

const entityTypeMessages = defineMessages({
  page: {
    id: "Iafyt5",
    defaultMessage: "Pages",
    description: "page attribute entity type",
  },
  product: {
    id: "5TUpjG",
    defaultMessage: "Products",
    description: "product attribute entity type",
  },
  productVariant: {
    id: "wsDF7X",
    defaultMessage: "Product variants",
    description: "product variant attribute entity type",
  },
});

export interface AttributeDetailsProps
  extends Pick<
    UseFormResult<AttributePageFormData>,
    "set" | "setError" | "data" | "clearErrors" | "errors"
  > {
  canChangeType: boolean;
  disabled: boolean;
  apiErrors: AttributeErrorFragment[];
  onChange: (event: ChangeEvent) => void;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = props => {
  const { canChangeType, errors, clearErrors, setError, data, disabled, apiErrors, onChange, set } =
    props;
  const intl = useIntl();
  const inputTypeChoices = [
    {
      label: intl.formatMessage(inputTypeMessages.dropdown),
      value: AttributeInputTypeEnum.DROPDOWN,
    },
    {
      label: intl.formatMessage(inputTypeMessages.multiselect),
      value: AttributeInputTypeEnum.MULTISELECT,
    },
    {
      label: intl.formatMessage(inputTypeMessages.file),
      value: AttributeInputTypeEnum.FILE,
    },
    {
      label: intl.formatMessage(inputTypeMessages.references),
      value: AttributeInputTypeEnum.REFERENCE,
    },
    {
      label: intl.formatMessage(inputTypeMessages.plainText),
      value: AttributeInputTypeEnum.PLAIN_TEXT,
    },
    {
      label: intl.formatMessage(inputTypeMessages.richText),
      value: AttributeInputTypeEnum.RICH_TEXT,
    },
    {
      label: intl.formatMessage(inputTypeMessages.numeric),
      value: AttributeInputTypeEnum.NUMERIC,
    },
    {
      label: intl.formatMessage(inputTypeMessages.boolean),
      value: AttributeInputTypeEnum.BOOLEAN,
    },
    {
      label: intl.formatMessage(inputTypeMessages.date),
      value: AttributeInputTypeEnum.DATE,
    },
    {
      label: intl.formatMessage(inputTypeMessages.dateTime),
      value: AttributeInputTypeEnum.DATE_TIME,
    },
    {
      label: intl.formatMessage(inputTypeMessages.swatch),
      value: AttributeInputTypeEnum.SWATCH,
    },
  ];
  const entityTypeChoices = [
    {
      label: intl.formatMessage(entityTypeMessages.page),
      value: AttributeEntityTypeEnum.PAGE,
    },
    {
      label: intl.formatMessage(entityTypeMessages.product),
      value: AttributeEntityTypeEnum.PRODUCT,
    },
    {
      label: intl.formatMessage(entityTypeMessages.productVariant),
      value: AttributeEntityTypeEnum.PRODUCT_VARIANT,
    },
  ];
  const formApiErrors = getFormErrors(
    ["name", "slug", "inputType", "entityType", "unit"],
    apiErrors,
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>
        <TextField
          data-test-id="attribute-default-label-input"
          disabled={disabled}
          error={!!formApiErrors.name}
          label={intl.formatMessage(messages.attributeLabel)}
          name={"name" as keyof AttributePageFormData}
          fullWidth
          helperText={getAttributeErrorMessage(formApiErrors.name, intl)}
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          data-test-id="attribute-code-input"
          disabled={disabled}
          error={!!formApiErrors.slug}
          label={intl.formatMessage(messages.attributeSlug)}
          name={"slug" as keyof AttributePageFormData}
          placeholder={slugify(data.name).toLowerCase()}
          fullWidth
          helperText={
            getAttributeSlugErrorMessage(formApiErrors.slug, intl) ||
            intl.formatMessage(messages.attributeSlugHelperText)
          }
          value={data.slug}
          onChange={onChange}
        />
        <FormSpacer />
        <Box display="flex" justifyContent="space-between" gap={4}>
          <Box width="100%">
            <Select
              data-test-id="attribute-type-select"
              aria-disabled={disabled || !canChangeType}
              disabled={disabled || !canChangeType}
              error={!!formApiErrors.inputType}
              helperText={getAttributeErrorMessage(formApiErrors.inputType, intl)}
              label={intl.formatMessage(messages.inputType)}
              name="inputType"
              onChange={onChange}
              value={data.inputType}
              options={inputTypeChoices}
            />
          </Box>
          {data.inputType === AttributeInputTypeEnum.REFERENCE && (
            <Box width="100%">
              <Select
                aria-disabled={disabled || !canChangeType}
                data-test-id="attribute-entity-type-select"
                disabled={disabled || !canChangeType}
                error={!!formApiErrors.entityType}
                helperText={getAttributeErrorMessage(formApiErrors.entityType, intl)}
                label={intl.formatMessage(messages.entityType)}
                name="entityType"
                onChange={onChange}
                value={data.entityType}
                options={entityTypeChoices}
              />
            </Box>
          )}
        </Box>
        <FormSpacer />
        <ControlledCheckbox
          name={"valueRequired" as keyof AttributePageFormData}
          label={intl.formatMessage(messages.valueRequired)}
          checked={data.valueRequired}
          onChange={onChange}
          disabled={disabled}
        />
        {data.inputType === AttributeInputTypeEnum.NUMERIC && (
          <NumericUnits
            data={data}
            errors={errors}
            disabled={disabled}
            clearErrors={clearErrors}
            setError={setError}
            set={set}
          />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeDetails.displayName = "AttributeDetails";
export default AttributeDetails;
