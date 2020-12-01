import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { commonMessages } from "@saleor/intl";
import {
  AttributeInputTypeEnum,
  AttributeTypeEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getAttributeErrorMessage from "@saleor/utils/errors/attribute";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AttributePageFormData } from "../AttributePage";

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
          <FormattedMessage
            defaultMessage="Storefront Properties"
            description="attribute properties regarding storefront"
          />
        </Typography>
        <Hr />
        {data.inputType !== AttributeInputTypeEnum.FILE &&
          data.type === AttributeTypeEnum.PRODUCT_TYPE && (
            <>
              <ControlledCheckbox
                name={"filterableInStorefront" as keyof FormData}
                label={intl.formatMessage({
                  defaultMessage: "Use in Faceted Navigation",
                  description: "attribute is filterable in storefront"
                })}
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
                    label={intl.formatMessage({
                      defaultMessage: "Position in faceted navigation",
                      description: "attribute position in storefront filters"
                    })}
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
              <FormattedMessage
                defaultMessage="Public"
                description="attribute visibility in storefront"
              />
              <Typography variant="caption">
                <FormattedMessage defaultMessage="If enabled, attribute will be accessible to customers." />
              </Typography>
            </>
          }
          checked={data.visibleInStorefront}
          onChange={onChange}
          disabled={disabled}
        />
        {data.inputType !== AttributeInputTypeEnum.FILE && (
          <>
            <CardSpacer />
            <Typography variant="subtitle1">
              <FormattedMessage
                defaultMessage="Dashboard Properties"
                description="attribute properties regarding dashboard"
              />
            </Typography>
            <Hr />
            <CardSpacer />
            <ControlledCheckbox
              name={"filterableInDashboard" as keyof FormData}
              label={
                <>
                  <FormattedMessage
                    defaultMessage="Use in Filtering"
                    description="use attribute in filtering"
                  />
                  <Typography variant="caption">
                    <FormattedMessage defaultMessage="If enabled, you’ll be able to use this attribute to filter products in product list." />
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
                  <FormattedMessage
                    defaultMessage="Add to Column Options"
                    description="add attribute as column in product list table"
                  />
                  <Typography variant="caption">
                    <FormattedMessage defaultMessage="If enabled this attribute can be used as a column in product table." />
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
