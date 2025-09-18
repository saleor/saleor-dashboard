// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { ProductTypeKindEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { Divider, Input, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypeDetailsProps {
  data?: {
    name: string;
    kind: ProductTypeKindEnum;
  };
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onKindChange: (event: React.ChangeEvent<any>) => void;
}

const kindOptions = [
  {
    title: messages.optionNormalTitle,
    type: ProductTypeKindEnum.NORMAL,
  },
  {
    title: messages.optionGiftCardTitle,
    subtitle: messages.optionGiftCardDescription,
    type: ProductTypeKindEnum.GIFT_CARD,
  },
];
const ProductTypeDetails = (props: ProductTypeDetailsProps) => {
  const { data, disabled, errors, onChange, onKindChange } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Input
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          width="100%"
          helperText={getFieldError(errors, "name")?.message}
          label={intl.formatMessage(messages.productTypeName)}
          name="name"
          onChange={onChange}
          value={data.name}
        />
      </DashboardCard.Content>
      <Divider />
      <DashboardCard.Content>
        <RadioGroupField
          disabled={disabled}
          choices={kindOptions.map(option => ({
            label: (
              <>
                <FormattedMessage {...option.title} />
                {option.subtitle && (
                  <Text color="default2" size={2} fontWeight="light" display="block">
                    <FormattedMessage {...option.subtitle} />
                  </Text>
                )}
              </>
            ),
            value: option.type,
          }))}
          name="kind"
          onChange={onKindChange}
          value={data.kind}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
