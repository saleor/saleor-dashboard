import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "@saleor/types";
import { AttributePageFormData } from "../AttributePage";

export interface AttributePropertiesProps {
  data: AttributePageFormData;
  disabled: boolean;
  errors: FormErrors<"storefrontSearchPosition">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeProperties: React.FC<AttributePropertiesProps> = ({
  data,
  errors,
  disabled,
  onChange
}) => {
  const intl = useIntl();

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
        <FormSpacer />
        {data.filterableInStorefront && (
          <TextField
            disabled={disabled}
            error={!!errors.storefrontSearchPosition}
            fullWidth
            helperText={errors.storefrontSearchPosition}
            name={"storefrontSearchPosition" as keyof AttributePageFormData}
            label={intl.formatMessage({
              defaultMessage: "Position in faceted navigation",
              description: "attribute position in storefront filters"
            })}
            value={data.storefrontSearchPosition}
            onChange={onChange}
          />
        )}
        <FormSpacer />
        <ControlledCheckbox
          name={"visibleInStorefront" as keyof FormData}
          label={intl.formatMessage({
            defaultMessage: "Visible on Product Page in Storefront",
            description: "attribute"
          })}
          checked={data.visibleInStorefront}
          onChange={onChange}
          disabled={disabled}
        />
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
      </CardContent>
    </Card>
  );
};
AttributeProperties.displayName = "AttributeProperties";
export default AttributeProperties;
