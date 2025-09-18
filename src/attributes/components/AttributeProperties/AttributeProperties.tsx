import { ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION } from "@dashboard/attributes/utils/data";
import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import { AttributeErrorFragment, AttributeTypeEnum } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAttributeErrorMessage from "@dashboard/utils/errors/attribute";
import { Box, Checkbox, Input, Paragraph, Text, Toggle } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { AttributePageFormData } from "../AttributePage";

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
});

interface AttributePropertiesProps {
  data: AttributePageFormData;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  onChange: FormChange;
}

const AttributeProperties = ({ data, errors, disabled, onChange }: AttributePropertiesProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["storefrontSearchPosition"], errors);
  const storefrontFacetedNavigationProperties =
    ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(data.inputType) &&
    data.type === AttributeTypeEnum.PRODUCT_TYPE;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(commonMessages.properties)}</DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>
        {storefrontFacetedNavigationProperties && (
          <>
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
              <Text fontWeight="medium" fontSize={3} display="block">
                {intl.formatMessage(messages.filterableInStorefront)}
              </Text>
            </Checkbox>

            {data.filterableInStorefront && (
              <>
                <FormSpacer />
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
            <FormSpacer />
          </>
        )}

        <Box className="multiline-toggle-wrapper">
          <Toggle
            name={"visibleInStorefront" as keyof FormData}
            pressed={data.visibleInStorefront}
            onPressedChange={pressed =>
              onChange({
                target: {
                  name: "visibleInStorefront" as keyof FormData,
                  value: pressed as boolean,
                },
              })
            }
            disabled={disabled}
          >
            <Paragraph fontWeight="medium" fontSize={3}>
              <FormattedMessage {...messages.visibleInStorefront} />
              <Text size={2} fontWeight="light" color="default2" display="block">
                <FormattedMessage {...messages.visibleInStorefrontCaption} />
              </Text>
            </Paragraph>
          </Toggle>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeProperties.displayName = "AttributeProperties";
export default AttributeProperties;
