import { messages as attributeClassMessages } from "@dashboard/components/AttributeClass/messages";
import { DashboardCard } from "@dashboard/components/Card";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { Box, Paragraph, RadioGroup } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useIntl } from "react-intl";

import { type AttributePageFormData } from "../AttributePage";

interface AttributeOrganizationProps {
  data: AttributePageFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeOrganization = ({ data, disabled, onChange }: AttributeOrganizationProps) => {
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
              <Paragraph fontSize={3} margin={0}>
                {intl.formatMessage(attributeClassMessages.productAttribute)}
              </Paragraph>
            </RadioGroup.Item>
            <RadioGroup.Item
              id={AttributeTypeEnum.PAGE_TYPE}
              value={AttributeTypeEnum.PAGE_TYPE}
              data-test-id={AttributeTypeEnum.PAGE_TYPE}
            >
              <Paragraph fontSize={3} margin={0}>
                {intl.formatMessage(attributeClassMessages.modelAttribute)}
              </Paragraph>
            </RadioGroup.Item>
          </Box>
        </RadioGroup>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

AttributeOrganization.displayName = "AttributeOrganization";
export default AttributeOrganization;
