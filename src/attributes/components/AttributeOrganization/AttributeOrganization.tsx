import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { commonMessages } from "@saleor/intl";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AttributePageFormData } from "../AttributePage";

export interface AttributeOrganizationProps {
  data: AttributePageFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeOrganization: React.FC<AttributeOrganizationProps> = ({
  data,
  disabled,
  onChange
}) => {
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
        <RadioGroupField
          choices={[
            {
              label: intl.formatMessage({
                defaultMessage: "Product Attribute",
                description: "attribute type"
              }),
              value: AttributeTypeEnum.PRODUCT_TYPE
            },
            {
              label: intl.formatMessage({
                defaultMessage: "Content Attribute",
                description: "attribute type"
              }),
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
      </CardContent>
    </Card>
  );
};
AttributeOrganization.displayName = "AttributeOrganization";
export default AttributeOrganization;
