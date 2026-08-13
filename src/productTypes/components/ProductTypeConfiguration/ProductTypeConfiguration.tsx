import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { ProductTypeKindEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const kindOptions = [
  {
    title: messages.optionNormalTitle,
    subtitle: messages.optionNormalDescription,
    type: ProductTypeKindEnum.NORMAL,
  },
  {
    title: messages.optionGiftCardTitle,
    subtitle: messages.optionGiftCardDescription,
    type: ProductTypeKindEnum.GIFT_CARD,
  },
];

interface ProductTypeConfigurationProps {
  data: {
    kind: ProductTypeKindEnum;
  };
  disabled: boolean;
  onKindChange: FormChange;
}

export const ProductTypeConfiguration = ({
  data,
  disabled,
  onKindChange,
}: ProductTypeConfigurationProps) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard
      title={intl.formatMessage(messages.typeConfiguration)}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage {...messages.kindIntro} />
        </Text>
      }
    >
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
    </DetailSettingsCard>
  );
};
