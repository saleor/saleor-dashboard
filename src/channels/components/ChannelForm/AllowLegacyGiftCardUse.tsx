import { FormChange } from "@dashboard/hooks/useForm";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface AllowLegacyGiftCardUseProps {
  onChange: FormChange;
  isChecked: boolean;
  hasError: boolean;
  disabled?: boolean;
}

export const AllowLegacyGiftCardUse = ({
  onChange,
  isChecked,
  hasError,
  disabled,
}: AllowLegacyGiftCardUseProps) => (
  <Box paddingX={6}>
    <Checkbox
      name="allowLegacyGiftCardUse"
      data-test-id="allow-legacy-gift-card-use"
      checked={isChecked}
      error={hasError}
      onCheckedChange={value => onChange({ target: { name: "allowLegacyGiftCardUse", value } })}
      disabled={disabled}
    >
      <Text>
        <FormattedMessage {...messages.allowLegacyGiftCardUseLabel} />
      </Text>{" "}
    </Checkbox>
    <Box paddingLeft={4}>
      {" "}
      <Text size={3} color="default2" paddingLeft={0.5}>
        <FormattedMessage {...messages.allowLegacyGiftCardUseDescription} />
      </Text>
    </Box>
  </Box>
);
