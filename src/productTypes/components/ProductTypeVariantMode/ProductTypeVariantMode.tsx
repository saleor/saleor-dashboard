import { DashboardCard } from "@dashboard/components/Card";
import { Text, Toggle } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

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
}: ProductTypeVariantModeProps) => (
  <DashboardCard>
    <DashboardCard.Content>
      <Toggle
        pressed={hasVariants}
        disabled={disabled}
        name="hasVariants"
        onPressedChange={pressed => onHasVariantsToggle(pressed)}
      >
        <Text>
          <FormattedMessage {...messages.usesVariantAttributes} />
        </Text>
      </Toggle>
    </DashboardCard.Content>
  </DashboardCard>
);
