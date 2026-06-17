import { NumericUnits } from "@dashboard/attributes/components/AttributeDetails/NumericUnits";
import { getAttributeInputTypeLabel } from "@dashboard/attributes/utils/getAttributeInputTypeLabel";
import { AttributeInputTypeOptionAdornment } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeOptionAdornment";
import { AttributeInputTypeOptionLabel } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeOptionLabel";
import { isAttributeInputTypeEnum } from "@dashboard/components/AttributeInputTypeIcon/isAttributeInputTypeEnum";
import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import { Select } from "@dashboard/components/Select";
import {
  AttributeEntityTypeEnum,
  type AttributeErrorFragment,
  AttributeInputTypeEnum,
} from "@dashboard/graphql";
import { type FormChange, type UseFormResult } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import { TextField } from "@material-ui/core";
import { Box, Combobox } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import slugify from "slugify";

import { getAttributeSlugErrorMessage } from "../../errors";
import { type AttributePageFormData } from "../AttributePage";
import { messages } from "./messages";

const attributeInputTypeOptions = Object.values(AttributeInputTypeEnum);

const entityTypeMessages = defineMessages({
  page: {
    id: "c7cakc",
    defaultMessage: "Models",
    description: "model attribute entity type",
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
  category: {
    id: "KzgcFV",
    defaultMessage: "Categories",
    description: "category attribute entity type",
  },
  collection: {
    id: "Crn8DZ",
    defaultMessage: "Collections",
    description: "collection attribute entity type",
  },
});

interface AttributeDetailsProps
  extends Pick<
    UseFormResult<AttributePageFormData>,
    "setError" | "data" | "clearErrors" | "errors"
  > {
  canChangeType: boolean;
  disabled: boolean;
  apiErrors: AttributeErrorFragment[];
  onChange: FormChange;
  onUnitChange: (unit: AttributePageFormData["unit"]) => void;
}

const AttributeDetails = (props: AttributeDetailsProps) => {
  const {
    canChangeType,
    errors,
    clearErrors,
    setError,
    data,
    disabled,
    apiErrors,
    onChange,
    onUnitChange,
  } = props;
  const intl = useIntl();
  const [inputTypeInputActive, setInputTypeInputActive] = useState(false);
  const showInputTypeDisplay =
    !inputTypeInputActive && Boolean(data.inputType) && isAttributeInputTypeEnum(data.inputType);
  const inputTypeChoices = useMemo(
    () =>
      attributeInputTypeOptions.map(inputType => ({
        label: getAttributeInputTypeLabel(intl, inputType),
        value: inputType,
        startAdornment: <AttributeInputTypeOptionAdornment inputType={inputType} />,
      })),
    [intl],
  );
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
    {
      label: intl.formatMessage(entityTypeMessages.category),
      value: AttributeEntityTypeEnum.CATEGORY,
    },
    {
      label: intl.formatMessage(entityTypeMessages.collection),
      value: AttributeEntityTypeEnum.COLLECTION,
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
            {/*
              Macaw Combobox renders startAdornment and the selected label as siblings
              (icon wrapper + native <input>), so they cannot be aligned. Same workaround
              as ProductOrganization: render icon + label in startAdornment and hide the
              duplicate input text until focus. Revisit when Macaw supports field adornments.
            */}
            <Combobox
              data-test-id="attribute-type-select"
              disabled={disabled || !canChangeType}
              error={!!formApiErrors.inputType}
              helperText={getAttributeErrorMessage(formApiErrors.inputType, intl)}
              label={intl.formatMessage(messages.inputType)}
              name="inputType"
              value={data.inputType}
              options={inputTypeChoices}
              onFocus={() => setInputTypeInputActive(true)}
              onBlur={() => setInputTypeInputActive(false)}
              startAdornment={value => {
                if (!showInputTypeDisplay || !value || !isAttributeInputTypeEnum(value)) {
                  return null;
                }

                return (
                  <AttributeInputTypeOptionLabel inputType={value} iconSize="small" textSize={3} />
                );
              }}
              onChange={value => {
                if (!value) {
                  return;
                }

                onChange({
                  target: { name: "inputType", value },
                });
              }}
              {...(showInputTypeDisplay && {
                width: "100%",
                __opacity: 0,
                position: "absolute",
              })}
            />
          </Box>
          {(data.inputType === AttributeInputTypeEnum.REFERENCE ||
            data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE) && (
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
        {data.inputType === AttributeInputTypeEnum.NUMERIC && (
          <NumericUnits
            data={data}
            errors={errors}
            disabled={disabled}
            clearErrors={clearErrors}
            setError={setError}
            onUnitChange={onUnitChange}
          />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeDetails.displayName = "AttributeDetails";
export default AttributeDetails;
