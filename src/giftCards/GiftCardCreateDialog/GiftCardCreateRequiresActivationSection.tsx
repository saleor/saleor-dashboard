import { Typography } from "@material-ui/core";
import ControlledCheckbox, {
  ControlledCheckboxProps,
} from "@saleor/components/ControlledCheckbox";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";

type GiftCardCreateRequiresActivationSectionProps = Pick<
  ControlledCheckboxProps,
  "checked" | "onChange"
>;

const GiftCardCreateRequiresActivationSection: React.FC<GiftCardCreateRequiresActivationSectionProps> = ({
  checked,
  onChange,
}) => (
  <ControlledCheckbox
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
