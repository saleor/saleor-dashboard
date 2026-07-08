import { ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION } from "@dashboard/attributes/utils/data";
import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import { type AttributeErrorFragment, AttributeTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import { Box, Checkbox, Input, Paragraph, Text } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { type AttributePageFormData } from "../AttributePage";
import styles from "./AttributeProperties.module.css";

const messages = defineMessages({
  availableInGrid: {
    id: "jswILH",
    defaultMessage: "Add to Column Options",
    description: "add attribute as column in product list table",
  },
  availableInGridCaption: {
    id: "AzMSmb",
    defaultMessage: "If enabled this attribute can be used as a column in product table.",
    description: "caption",
  },
  dashboardPropertiesTitle: {
    id: "lCxfDe",
    defaultMessage: "Dashboard Properties",
    description: "attribute properties regarding dashboard",
  },
  filterableInDashboard: {
    id: "j5hGyJ",
    defaultMessage: "Filterable in dashboard",
    description: "attribute is filterable in dashboard",
  },
  filterableInDashboardCaption: {
    id: "Q9wTrz",
    defaultMessage:
      "If enabled, you’ll be able to use this attribute to filter products in product list.",
    description: "caption",
  },
  filterableInStorefront: {
    defaultMessage: "Filterable in storefront",
    id: "SV0FRm",
    description: "attribute is filterable in storefront",
  },
  filterableInStorefrontCaption: {
    id: "vz1vWe",
    defaultMessage:
      "If enabled, customers can use this attribute to filter products in the storefront.",
    description: "caption",
  },
  storefrontPropertiesTitle: {
    id: "AgY5Mv",
    defaultMessage: "Storefront Properties",
    description: "attribute properties regarding storefront",
  },
  storefrontSearchPosition: {
    id: "cJ5ASN",
    defaultMessage: "Position in faceted navigation",
    description: "attribute position in storefront filters",
  },
  visibleInStorefront: {
    id: "inWs4U",
    defaultMessage: "Visible in storefront",
    description: "attribute visibility in storefront",
  },
  visibleInStorefrontCaption: {
    id: "h2Hta6",
    defaultMessage: "If enabled, attribute will be accessible to customers.",
    description: "caption",
  },
  valueRequired: {
    id: "njBulj",
    defaultMessage: "Value Required",
    description: "check to require attribute to have value",
  },
  valueRequiredCaption: {
    id: "w1puHO",
    defaultMessage: "If enabled, a value must be provided when this attribute is used.",
    description: "caption",
  },
});

interface AttributePropertiesProps {
  data: AttributePageFormData;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  onChange: FormChange;
  variant?: "card" | "embedded";
}

const AttributeProperties = ({
  data,
  errors,
  disabled,
  onChange,
  variant = "card",
}: AttributePropertiesProps) => {
  const intl = useIntl();
  const isEmbedded = variant === "embedded";
  const formErrors = getFormErrors(["storefrontSearchPosition"], errors);
  const storefrontFacetedNavigationProperties =
    ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(data.inputType) &&
    data.type === AttributeTypeEnum.PRODUCT_TYPE;
  const propertySpacer = isEmbedded ? null : <FormSpacer />;

  const propertiesContent = (
    <>
      <Box className={styles.propertyControl}>
        <Checkbox
          name={"valueRequired" as keyof AttributePageFormData}
          checked={data.valueRequired}
          onCheckedChange={checked =>
            onChange({ target: { name: "valueRequired", value: checked } })
          }
          disabled={disabled}
        >
          <Paragraph fontWeight="medium" fontSize={3} margin={0}>
            <FormattedMessage {...messages.valueRequired} />
            <Text size={2} fontWeight="light" color="default2" display="block">
              <FormattedMessage {...messages.valueRequiredCaption} />
            </Text>
          </Paragraph>
        </Checkbox>
      </Box>

      {propertySpacer}

      {storefrontFacetedNavigationProperties && (
        <>
          <Box className={styles.propertyControl}>
            <Checkbox
              name={"filterableInStorefront" as keyof FormData}
              checked={data.filterableInStorefront}
              onCheckedChange={checked =>
                onChange({
                  target: {
                    name: "filterableInStorefront",
                    value: checked as boolean,
                  },
                })
              }
              disabled={disabled}
            >
              <Paragraph fontWeight="medium" fontSize={3} margin={0}>
                <FormattedMessage {...messages.filterableInStorefront} />
                <Text size={2} fontWeight="light" color="default2" display="block">
                  <FormattedMessage {...messages.filterableInStorefrontCaption} />
                </Text>
              </Paragraph>
            </Checkbox>
          </Box>

          {data.filterableInStorefront && (
            <>
              {propertySpacer}
              <Input
                disabled={disabled}
                error={!!formErrors.storefrontSearchPosition}
                width="100%"
                helperText={getAttributeErrorMessage(formErrors.storefrontSearchPosition, intl)}
                name={"storefrontSearchPosition" as keyof AttributePageFormData}
                label={intl.formatMessage(messages.storefrontSearchPosition)}
                value={data.storefrontSearchPosition}
                onChange={onChange}
              />
            </>
          )}
          {propertySpacer}
        </>
      )}

      <Box className={styles.propertyControl}>
        <Checkbox
          name={"visibleInStorefront" as keyof FormData}
          checked={data.visibleInStorefront}
          onCheckedChange={checked =>
            onChange({
              target: {
                name: "visibleInStorefront" as keyof FormData,
                value: checked as boolean,
              },
            })
          }
          disabled={disabled}
        >
          <Paragraph fontWeight="medium" fontSize={3} margin={0}>
            <FormattedMessage {...messages.visibleInStorefront} />
            <Text size={2} fontWeight="light" color="default2" display="block">
              <FormattedMessage {...messages.visibleInStorefrontCaption} />
            </Text>
          </Paragraph>
        </Checkbox>
      </Box>
    </>
  );

  if (isEmbedded) {
    return (
      <Box display="flex" flexDirection="column" gap={3}>
        <Text size={3} fontWeight="bold">
          {intl.formatMessage(commonMessages.properties)}
        </Text>
        <Box display="flex" flexDirection="column" gap={3}>
          {propertiesContent}
        </Box>
      </Box>
    );
  }

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(commonMessages.properties)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>{propertiesContent}</DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeProperties.displayName = "AttributeProperties";
export default AttributeProperties;
