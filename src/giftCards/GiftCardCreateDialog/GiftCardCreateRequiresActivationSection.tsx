import ControlledCheckbox, {
  ControlledCheckboxProps,
} from "@dashboard/components/ControlledCheckbox";
import { Typography } from "@material-ui/core";
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
        <Typography variant="caption">
          <FormattedMessage {...messages.requiresActivationCaption} />
        </Typography>
      </>
    }
    checked={checked}
    onChange={onChange}
  />
);

export default GiftCardCreateRequiresActivationSection;
