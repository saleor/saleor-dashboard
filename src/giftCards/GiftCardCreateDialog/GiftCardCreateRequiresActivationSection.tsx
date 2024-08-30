import { FormChange } from "@dashboard/hooks/useForm";
import { Checkbox, CheckboxProps, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";

type GiftCardCreateRequiresActivationSectionProps = Pick<CheckboxProps, "checked"> & {
  onChange: FormChange;
};

const GiftCardCreateRequiresActivationSection: React.FC<
  GiftCardCreateRequiresActivationSectionProps
> = ({ checked, onChange }) => (
  <Checkbox
    data-test-id="requires-activation-section"
    name="requiresActivation"
    checked={checked}
    onCheckedChange={value => onChange({ target: { name: "requiresActivation", value } })}
  >
    <Text>
      <FormattedMessage {...messages.requiresActivationLabel} />

      <Text size={2} fontWeight="light" display="block">
        <FormattedMessage {...messages.requiresActivationCaption} />
      </Text>
    </Text>
  </Checkbox>
);

export default GiftCardCreateRequiresActivationSection;
