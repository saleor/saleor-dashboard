import { DashboardCard } from "@dashboard/components/Card";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { AttributePageFormData } from "../AttributePage";

interface AttributeOrganizationProps {
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
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "nwvQPg",
            defaultMessage: "Organization",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>
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
                <FormattedMessage id="v1pNHW" defaultMessage="Attribute Class" />
                <Text fontWeight="medium" fontSize={3} display="block">
                  <FormattedMessage
                    id="ErNH3D"
                    defaultMessage="Define where this attribute should be used in Saleor system"
                  />
                </Text>
              </>
            }
            name={"type" as keyof FormData}
            value={data.type as AttributeTypeEnum}
            onChange={onChange}
          />
        ) : (
          <>
            <Text className={classes.label} size={2} fontWeight="light" display="block">
              <FormattedMessage id="v1pNHW" defaultMessage="Attribute Class" />
            </Text>
            <Text>
              {data.type === AttributeTypeEnum.PRODUCT_TYPE
                ? intl.formatMessage(messages.productAttribute)
                : intl.formatMessage(messages.contentAttribute)}
            </Text>
          </>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeOrganization.displayName = "AttributeOrganization";
export default AttributeOrganization;
