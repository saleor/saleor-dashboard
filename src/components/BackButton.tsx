import { buttonMessages } from "@dashboard/intl";
import { Button, ButtonProps } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface BackButtonProps extends ButtonProps {
  children?: ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ children, ...props }) => (
  <Button data-test-id="back" variant="secondary" {...props}>
    {children ?? <FormattedMessage {...buttonMessages.back} />}
  </Button>
);

BackButton.displayName = "BackButton";
export default BackButton;
