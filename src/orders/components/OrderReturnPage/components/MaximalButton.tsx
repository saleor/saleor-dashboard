import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface MaximalButtonProps {
  onClick: () => void;
}

export const MaximalButton = ({ onClick }: MaximalButtonProps) => (
  <Button
    onClick={onClick}
    data-test-id="set-maximal-quantity-unfulfilled-button"
    marginY={2}
    size="small"
    variant="secondary"
  >
    <FormattedMessage id="2W4EBM" defaultMessage="Set maximal quantities" description="button" />
  </Button>
);
