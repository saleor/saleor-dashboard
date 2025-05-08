import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface MaximalButtonProps {
  onClick: () => void;
}

const MaximalButton: React.FC<MaximalButtonProps> = ({ onClick }) => (
  <Button
    variant="secondary"
    onClick={onClick}
    data-test-id="set-maximal-quantity-unfulfilled-button"
    marginBottom={3}
    size="small"
  >
    <FormattedMessage id="2W4EBM" defaultMessage="Set maximal quantities" description="button" />
  </Button>
);

export default MaximalButton;
