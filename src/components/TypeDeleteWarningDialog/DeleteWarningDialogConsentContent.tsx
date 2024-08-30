import { Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface DeleteWarningDialogConsentContentProps {
  description: string | React.ReactNode[] | readonly React.ReactNode[];
  consentLabel: string;
  isConsentChecked: boolean;
  onConsentChange: (value: boolean) => void;
}

const DeleteWarningDialogConsentContent: React.FC<DeleteWarningDialogConsentContentProps> = ({
  description,
  consentLabel,
  isConsentChecked,
  onConsentChange,
}) => (
  <>
    <Text>{description}</Text>

    {consentLabel && (
      <Checkbox
        name="delete-assigned-items-consent"
        checked={isConsentChecked}
        onCheckedChange={onConsentChange}
      >
        <Text>{consentLabel}</Text>
      </Checkbox>
    )}
  </>
);

export default DeleteWarningDialogConsentContent;
