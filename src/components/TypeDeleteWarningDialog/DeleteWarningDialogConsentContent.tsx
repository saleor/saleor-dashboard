import { Checkbox, Text } from "@saleor/macaw-ui-next";

interface DeleteWarningDialogConsentContentProps {
  consentLabel: string;
  isConsentChecked: boolean;
  onConsentChange: (value: boolean) => void;
}

const DeleteWarningDialogConsentContent = ({
  consentLabel,
  isConsentChecked,
  onConsentChange,
}: DeleteWarningDialogConsentContentProps) => (
  <Checkbox
    name="delete-assigned-items-consent"
    data-test-id="delete-assigned-items-consent"
    checked={isConsentChecked}
    onCheckedChange={value => onConsentChange(!!value)}
  >
    <Text>{consentLabel}</Text>
  </Checkbox>
);

export default DeleteWarningDialogConsentContent;
