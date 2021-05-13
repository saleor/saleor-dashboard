import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { makeStyles } from "@saleor/theme";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { AttributePageFormData } from "../AttributePage";

export interface AttributeOrganizationProps {
  canChangeType: boolean;
  data: AttributePageFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
  contentAttribute: {
    defaultMessage: "Content Attribute",
    description: "attribute type"
  },
  productAttribute: {
    defaultMessage: "Product Attribute",
    description: "attribute type"
  }
});

const useStyles = makeStyles(
  theme => ({
    card: {
      overflow: "visible"
    },
    cardSubtitle: {
      fontSize: "1rem",
      marginBottom: theme.spacing(0.5)
    },
    label: {
      marginBottom: theme.spacing(0.5)
    }
  }),
  { name: "AttributeOrganization" }
);

const AttributeOrganization: React.FC<AttributeOrganizationProps> = props => {
  const { canChangeType, data, disabled, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Organization",
          description: "section header"
        })}
      />
      <CardContent>
        {canChangeType ? (
          <RadioGroupField
            choices={[
              {
                label: intl.formatMessage(messages.productAttribute),
                value: AttributeTypeEnum.PRODUCT_TYPE
              },
              {
                label: intl.formatMessage(messages.contentAttribute),
                value: AttributeTypeEnum.PAGE_TYPE
              }
            ]}
            disabled={disabled}
            label={
              <>
                <FormattedMessage defaultMessage="Attribute Class" />
                <Typography variant="caption">
                  <FormattedMessage defaultMessage="Define where this attribute should be used in Saleor system" />
                </Typography>
              </>
            }
            name={"type" as keyof FormData}
            value={data.type}
            onChange={onChange}
          />
        ) : (
          <>
            <Typography className={classes.label} variant="caption">
              <FormattedMessage defaultMessage="Attribute Class" />
            </Typography>
            <Typography>
              {data.type === AttributeTypeEnum.PRODUCT_TYPE
                ? intl.formatMessage(messages.productAttribute)
                : intl.formatMessage(messages.contentAttribute)}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};
AttributeOrganization.displayName = "AttributeOrganization";
export default AttributeOrganization;
