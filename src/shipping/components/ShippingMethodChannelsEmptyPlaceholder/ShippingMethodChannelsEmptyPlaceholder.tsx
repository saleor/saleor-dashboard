import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { Lock } from "lucide-react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  assignChannelsFirst: {
    id: "8thmJ/",
    defaultMessage: "Assign channels in Availability before configuring this section.",
    description: "empty state when shipping method has no assigned channels",
  },
});

export const ShippingMethodChannelsEmptyPlaceholder = (): JSX.Element => (
  <Placeholder
    icon={<Lock size={iconSize.medium} strokeWidth={iconStrokeWidthBySize.medium} aria-hidden />}
  >
    <FormattedMessage {...messages.assignChannelsFirst} />
  </Placeholder>
);
