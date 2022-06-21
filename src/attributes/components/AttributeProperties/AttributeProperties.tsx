import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION } from "@saleor/attributes/utils/data";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import { AttributeErrorFragment, AttributeTypeEnum } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getAttributeErrorMessage from "@saleor/utils/errors/attribute";
import React from "react";
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
    defaultMessage:
      "If enabled this attribute can be used as a column in product table.",
    description: "caption",
  },
  dashboardPropertiesTitle: {
    id: "lCxfDe",
    defaultMessage: "Dashboard Properties",
    description: "attribute properties regarding dashboard",
  },
  filterableInDashboard: {
    id: "RH+aOF",
    defaultMessage: "Use in Filtering",
    description: "use attribute in filtering",
  },
  filterableInDashboardCaption: {
    id: "Q9wTrz",
    defaultMessage:
      "If enabled, you’ll be able to use this attribute to filter products in product list.",
    description: "caption",
  },
  filterableInStorefront: {
    defaultMessage: "Use as filter",
    id: "e1vU/4",
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
    id: "x8V/xS",
    defaultMessage: "Public",
    description: "attribute visibility in storefront",
  },
  visibleInStorefrontCaption: {
    id: "h2Hta6",
    defaultMessage: "If enabled, attribute will be accessible to customers.",
    description: "caption",
  },
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
  onChange,
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["storefrontSearchPosition"], errors);

  const storefrontFacetedNavigationProperties =
    ATTRIBUTE_TYPES_WITH_CONFIGURABLE_FACED_NAVIGATION.includes(
      data.inputType,
    ) && data.type === AttributeTypeEnum.PRODUCT_TYPE;

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.properties)} />
      <CardContent>
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
                    intl,
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
            <FormSpacer />
          </>
        )}
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
      </CardContent>
    </Card>
  );
};
AttributeProperties.displayName = "AttributeProperties";
export default AttributeProperties;
