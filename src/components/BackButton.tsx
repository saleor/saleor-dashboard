import { Button } from "@dashboard/components/Button";
import { buttonMessages } from "@dashboard/intl";
import { ButtonProps } from "@saleor/macaw-ui";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface BackButtonProps extends ButtonProps {
  children?: ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ children, ...props }) => (
  <Button data-test-id="back" variant="secondary" color="text" {...props}>
    {children ?? <FormattedMessage {...buttonMessages.back} />}
  </Button>
);

BackButton.displayName = "BackButton";
export default BackButton;
