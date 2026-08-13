import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailSettingToggleRow } from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypeVariantModeProps {
  hasVariants: boolean;
  disabled: boolean;
  onHasVariantsToggle: (hasVariants: boolean) => void;
}

export const ProductTypeVariantMode = ({
  hasVariants,
  disabled,
  onHasVariantsToggle,
}: ProductTypeVariantModeProps) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard title={intl.formatMessage(messages.title)} contentFlush>
      <DetailSettingToggleRow
        title={<FormattedMessage {...messages.usesVariantAttributes} />}
        description={<FormattedMessage {...messages.usesVariantAttributesDescription} />}
        pressed={hasVariants}
        disabled={disabled}
        testId="hasVariants"
        onPressedChange={onHasVariantsToggle}
      />
    </DetailSettingsCard>
  );
};
