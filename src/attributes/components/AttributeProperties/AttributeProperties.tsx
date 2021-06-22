import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION } from "@saleor/attributes/utils/data";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { commonMessages } from "@saleor/intl";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getAttributeErrorMessage from "@saleor/utils/errors/attribute";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { AttributePageFormData } from "../AttributePage";

const messages = defineMessages({
  availableInGrid: {
    defaultMessage: "Add to Column Options",
    description: "add attribute as column in product list table"
  },
  availableInGridCaption: {
    defaultMessage:
      "If enabled this attribute can be used as a column in product table.",
    description: "caption"
  },
  dashboardPropertiesTitle: {
    defaultMessage: "Dashboard Properties",
    description: "attribute properties regarding dashboard"
  },
  filterableInDashboard: {
    defaultMessage: "Use in Filtering",
    description: "use attribute in filtering"
  },
  filterableInDashboardCaption: {
    defaultMessage:
      "If enabled, you’ll be able to use this attribute to filter products in product list.",
    description: "caption"
  },
  filterableInStorefront: {
    defaultMessage: "Use in Faceted Navigation",
    description: "attribute is filterable in storefront"
  },
  storefrontPropertiesTitle: {
    defaultMessage: "Storefront Properties",
    description: "attribute properties regarding storefront"
  },
  storefrontSearchPosition: {
    defaultMessage: "Position in faceted navigation",
    description: "attribute position in storefront filters"
  },
  visibleInStorefront: {
    defaultMessage: "Public",
    description: "attribute visibility in storefront"
  },
  visibleInStorefrontCaption: {
    defaultMessage: "If enabled, attribute will be accessible to customers.",
    description: "caption"
  }
});

export interface AttributePropertiesProps {
  data: AttributePageFormData;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeProperties: React.FC<AttributePropertiesProps> = ({
  data,
  errors,
  disabled,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["storefrontSearchPosition"], errors);

  const dashboardProperties = ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(
    data.inputType
  );

  const storefrontFacetedNavigationProperties =
    ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(
      data.inputType
    ) && data.type === AttributeTypeEnum.PRODUCT_TYPE;

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.properties)} />
      <CardContent>
        {/* <Typography variant="subtitle1">
          <FormattedMessage
            defaultMessage="General Properties"
            description="attribute general properties section"
            
          />
        </Typography>
        <Hr />
        <CardSpacer />
        <ControlledSwitch
          name={"" as keyof AttributePageFormData}
          checked={false}
          disabled={disabled}
          label={
            <>
              <FormattedMessage
                defaultMessage="Variant Attribute"
                description="attribute is variant-only"
                
              />
              <Typography variant="caption">
                <FormattedMessage
                  defaultMessage="If enabled, you'll be able to use this attribute to create product variants"
                  
                />
              </Typography>
            </>
          }
          onChange={onChange}
        /> */}

        <Typography variant="subtitle1">
          <FormattedMessage {...messages.storefrontPropertiesTitle} />
        </Typography>
        <Hr />
        {storefrontFacetedNavigationProperties && (
          <>
            <ControlledCheckbox
              name={"filterableInStorefront" as keyof FormData}
              label={intl.formatMessage(messages.filterableInStorefront)}
              checked={data.filterableInStorefront}
              onChange={onChange}
              disabled={disabled}
            />
            {data.filterableInStorefront && (
              <>
                <FormSpacer />
                <TextField
                  disabled={disabled}
                  error={!!formErrors.storefrontSearchPosition}
                  fullWidth
                  helperText={getAttributeErrorMessage(
                    formErrors.storefrontSearchPosition,
                    intl
                  )}
                  name={
                    "storefrontSearchPosition" as keyof AttributePageFormData
                  }
                  label={intl.formatMessage(messages.storefrontSearchPosition)}
                  value={data.storefrontSearchPosition}
                  onChange={onChange}
                />
              </>
            )}
          </>
        )}
        <FormSpacer />
        <ControlledSwitch
          name={"visibleInStorefront" as keyof FormData}
          label={
            <>
              <FormattedMessage {...messages.visibleInStorefront} />
              <Typography variant="caption">
                <FormattedMessage {...messages.visibleInStorefrontCaption} />
              </Typography>
            </>
          }
          checked={data.visibleInStorefront}
          onChange={onChange}
          disabled={disabled}
        />
        {dashboardProperties && (
          <>
            <CardSpacer />
            <Typography variant="subtitle1">
              <FormattedMessage {...messages.dashboardPropertiesTitle} />
            </Typography>
            <Hr />
            <CardSpacer />
            <ControlledCheckbox
              name={"filterableInDashboard" as keyof FormData}
              label={
                <>
                  <FormattedMessage {...messages.filterableInDashboard} />
                  <Typography variant="caption">
                    <FormattedMessage
                      {...messages.filterableInDashboardCaption}
                    />
                  </Typography>
                </>
              }
              checked={data.filterableInDashboard}
              onChange={onChange}
              disabled={disabled}
            />
            <FormSpacer />
            <ControlledCheckbox
              name={"availableInGrid" as keyof FormData}
              label={
                <>
                  <FormattedMessage {...messages.availableInGrid} />
                  <Typography variant="caption">
                    <FormattedMessage {...messages.availableInGridCaption} />
                  </Typography>
                </>
              }
              checked={data.availableInGrid}
              onChange={onChange}
              disabled={disabled}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
AttributeProperties.displayName = "AttributeProperties";
export default AttributeProperties;
