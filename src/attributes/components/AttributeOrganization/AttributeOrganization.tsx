import { DashboardCard } from "@dashboard/components/Card";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, RadioGroup, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
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
const AttributeOrganization = (props: AttributeOrganizationProps) => {
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
          <RadioGroup
            label={intl.formatMessage({
              id: "T0lfLH",
              defaultMessage: "Define where this attribute should be used in Saleor system",
              description: "Define where this attribute should be used in Saleor system",
            })}
            size="medium"
            value={data.type as AttributeTypeEnum}
            onValueChange={value => {
              onChange({ target: { name: "type", value } } as React.ChangeEvent<HTMLInputElement>);
            }}
            disabled={disabled}
          >
            <Box marginTop={2}>
              <RadioGroup.Item
                id={AttributeTypeEnum.PRODUCT_TYPE}
                value={AttributeTypeEnum.PRODUCT_TYPE}
                data-test-id={AttributeTypeEnum.PRODUCT_TYPE}
                marginBottom={2}
              >
                <Text size={2}>{intl.formatMessage(messages.productAttribute)}</Text>
              </RadioGroup.Item>
              <RadioGroup.Item
                id={AttributeTypeEnum.PAGE_TYPE}
                value={AttributeTypeEnum.PAGE_TYPE}
                data-test-id={AttributeTypeEnum.PAGE_TYPE}
              >
                <Text size={2}>{intl.formatMessage(messages.contentAttribute)}</Text>
              </RadioGroup.Item>
            </Box>
          </RadioGroup>
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
