import { FormattedMessage } from "react-intl";

import { ChannelSettingToggleRow } from "./ChannelSettingToggleRow";
import { messages } from "./messages";

interface AllowLegacyGiftCardUseProps {
  isChecked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const AllowLegacyGiftCardUse = ({
  isChecked,
  disabled,
  onCheckedChange,
}: AllowLegacyGiftCardUseProps) => (
  <ChannelSettingToggleRow
    testId="allow-legacy-gift-card-use"
    title={<FormattedMessage {...messages.allowLegacyGiftCardUseLabel} />}
    description={<FormattedMessage {...messages.allowLegacyGiftCardUseDescription} />}
    pressed={isChecked}
    onPressedChange={onCheckedChange}
    disabled={disabled}
  />
);
