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
import styles from "./AttributeDetails.module.css";
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
  variant?: "card" | "embedded";
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
    variant = "card",
  } = props;
  const intl = useIntl();
  const isEmbedded = variant === "embedded";
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

  const slugPlaceholder = slugify(data.name).toLowerCase();
  const fields = (
    <Box display="flex" flexDirection="column" gap={isEmbedded ? 6 : undefined}>
      <TextField
        autoComplete="off"
        data-test-id="attribute-default-label-input"
        disabled={disabled}
        error={!!formApiErrors.name}
        label={intl.formatMessage(
          isEmbedded ? messages.embeddedAttributeLabel : messages.attributeLabel,
        )}
        name={"name" as keyof AttributePageFormData}
        placeholder={
          isEmbedded ? intl.formatMessage(messages.embeddedAttributeLabelPlaceholder) : undefined
        }
        fullWidth
        helperText={
          getAttributeErrorMessage(formApiErrors.name, intl) ||
          (isEmbedded ? intl.formatMessage(messages.embeddedAttributeLabelHelper) : undefined)
        }
        value={data.name}
        onChange={onChange}
      />
      {!isEmbedded ? <FormSpacer /> : null}
      <TextField
        autoComplete="off"
        className={isEmbedded ? styles.codeInput : undefined}
        data-test-id="attribute-code-input"
        disabled={disabled}
        error={!!formApiErrors.slug}
        label={intl.formatMessage(
          isEmbedded ? messages.embeddedAttributeSlug : messages.attributeSlug,
        )}
        name={"slug" as keyof AttributePageFormData}
        placeholder={slugPlaceholder}
        fullWidth
        helperText={
          getAttributeSlugErrorMessage(formApiErrors.slug, intl) ||
          intl.formatMessage(
            isEmbedded ? messages.embeddedAttributeSlugHelper : messages.attributeSlugHelperText,
          )
        }
        value={data.slug}
        onChange={onChange}
      />
      {!isEmbedded ? <FormSpacer /> : null}
      <Box
        display="flex"
        flexDirection={isEmbedded ? "column" : "row"}
        justifyContent="space-between"
        gap={4}
      >
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
            helperText={
              getAttributeErrorMessage(formApiErrors.inputType, intl) ||
              (isEmbedded ? intl.formatMessage(messages.embeddedInputTypeHelper) : undefined)
            }
            label={intl.formatMessage(isEmbedded ? messages.embeddedInputType : messages.inputType)}
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
              helperText={
                getAttributeErrorMessage(formApiErrors.entityType, intl) ||
                intl.formatMessage(
                  isEmbedded ? messages.embeddedEntityTypeHelper : messages.entityTypeHelper,
                )
              }
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
    </Box>
  );

  if (isEmbedded) {
    return fields;
  }

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>{fields}</DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeDetails.displayName = "AttributeDetails";
export default AttributeDetails;
