import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import {
  DetailSettingNestedField,
  DetailSettingToggleRow,
} from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypeShippingProps {
  data: {
    isShippingRequired: boolean;
    weight: number | null;
  };
  weightUnit: string;
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
}

const ProductTypeShipping = ({
  data,
  weightUnit,
  disabled,
  onChange,
}: ProductTypeShippingProps) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard title={intl.formatMessage(messages.title)} contentFlush>
      <DetailSettingToggleRow
        title={<FormattedMessage {...messages.requiresShipping} />}
        description={<FormattedMessage {...messages.requiresShippingDescription} />}
        pressed={data.isShippingRequired}
        disabled={disabled}
        testId="isShippingRequired"
        onPressedChange={checked =>
          onChange({
            target: { name: "isShippingRequired", value: checked },
          })
        }
      >
        {data.isShippingRequired ? (
          <DetailSettingNestedField>
            <Input
              disabled={disabled}
              endAdornment={<Text color="default2">{weightUnit}</Text>}
              label={intl.formatMessage(messages.weight)}
              name="weight"
              helperText={intl.formatMessage(messages.weightHelper)}
              type="number"
              value={data.weight || 0}
              onChange={onChange}
            />
          </DetailSettingNestedField>
        ) : null}
      </DetailSettingToggleRow>
    </DetailSettingsCard>
  );
};

ProductTypeShipping.displayName = "ProductTypeShipping";
export default ProductTypeShipping;
