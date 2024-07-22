import ControlledCheckbox, {
  ControlledCheckboxProps,
} from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";

type GiftCardCreateRequiresActivationSectionProps = Pick<
  ControlledCheckboxProps,
  "checked" | "onChange"
>;

const GiftCardCreateRequiresActivationSection: React.FC<
  GiftCardCreateRequiresActivationSectionProps
> = ({ checked, onChange }) => (
  <ControlledCheckbox
    data-test-id="requires-activation-section"
    name="requiresActivation"
    label={
      <>
        <FormattedMessage {...messages.requiresActivationLabel} />
        <Text size={2} fontWeight="light">
          <FormattedMessage {...messages.requiresActivationCaption} />
        </Text>
      </>
    }
    checked={checked}
    onChange={onChange}
  />
);

export default GiftCardCreateRequiresActivationSection;
