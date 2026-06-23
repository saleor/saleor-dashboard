import useNavigator from "@dashboard/hooks/useNavigator";
import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { shippingZoneMethodsMessages } from "./messages";

interface SetUpPricingButtonProps {
  disabled: boolean;
  href: string;
}

export const SetUpPricingButton = ({ disabled, href }: SetUpPricingButtonProps) => {
  const navigate = useNavigator();

  return (
    <Button
      disabled={disabled}
      variant="tertiary"
      size="small"
      data-test-id="set-up-pricing"
      onClick={event => {
        event.stopPropagation();
        navigate(href);
      }}
    >
      <FormattedMessage {...shippingZoneMethodsMessages.setUpPricing} />
    </Button>
  );
};

SetUpPricingButton.displayName = "SetUpPricingButton";
