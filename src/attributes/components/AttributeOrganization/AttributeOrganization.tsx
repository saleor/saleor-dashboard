import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { AttributeTypeEnum } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
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
    id: "zbJHl7",
    defaultMessage: "Content Attribute",
    description: "attribute type",
  },
  productAttribute: {
    id: "qkRuT0",
    defaultMessage: "Product Attribute",
    description: "attribute type",
  },
});

const useStyles = makeStyles(
  theme => ({
    card: {
      overflow: "visible",
    },
    cardSubtitle: {
      fontSize: theme.typography.body1.fontSize,
      marginBottom: theme.spacing(0.5),
    },
    label: {
      marginBottom: theme.spacing(0.5),
    },
  }),
  { name: "AttributeOrganization" },
);

const AttributeOrganization: React.FC<AttributeOrganizationProps> = props => {
  const { canChangeType, data, disabled, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "nwvQPg",
          defaultMessage: "Organization",
          description: "section header",
        })}
      />
      <CardContent>
        {canChangeType ? (
          <RadioGroupField
            choices={[
              {
                label: intl.formatMessage(messages.productAttribute),
                value: AttributeTypeEnum.PRODUCT_TYPE,
              },
              {
                label: intl.formatMessage(messages.contentAttribute),
                value: AttributeTypeEnum.PAGE_TYPE,
              },
            ]}
            disabled={disabled}
            label={
              <>
                <FormattedMessage
                  id="v1pNHW"
                  defaultMessage="Attribute Class"
                />
                <Typography variant="caption">
                  <FormattedMessage
                    id="ErNH3D"
                    defaultMessage="Define where this attribute should be used in Saleor system"
                  />
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
              <FormattedMessage id="v1pNHW" defaultMessage="Attribute Class" />
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
