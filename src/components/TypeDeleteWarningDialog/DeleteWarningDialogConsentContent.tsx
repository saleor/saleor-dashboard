import { Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface DeleteWarningDialogConsentContentProps {
  description: string | React.ReactNode[] | readonly React.ReactNode[];
  consentLabel: string;
  isConsentChecked: boolean;
  onConsentChange: (value: boolean) => void;
}

const DeleteWarningDialogConsentContent = ({
  description,
  consentLabel,
  isConsentChecked,
  onConsentChange,
}: DeleteWarningDialogConsentContentProps) => (
  <>
    <Text>{description}</Text>
    {consentLabel && (
      <Checkbox
        name="delete-assigned-items-consent"
        data-test-id="delete-assigned-items-consent"
        checked={isConsentChecked}
        onCheckedChange={value => onConsentChange(!!value)}
      >
        <Text>{consentLabel}</Text>
      </Checkbox>
    )}
  </>
);

export default DeleteWarningDialogConsentContent;
