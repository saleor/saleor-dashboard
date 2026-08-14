import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import styles from "./AttributeValuePasteProposal.module.css";
import { attributeValuePasteMessages } from "./messages";

interface AttributeValuePasteProposalProps {
  disabled: boolean;
  values: string[];
  onAdd: () => void;
  onKeepAsOne: () => void;
}

export const AttributeValuePasteProposal = ({
  disabled,
  values,
  onAdd,
  onKeepAsOne,
}: AttributeValuePasteProposalProps): JSX.Element => (
  <Box className={styles.pasteProposal} data-test-id="attribute-value-paste-proposal">
    <Text size={2} fontWeight="medium">
      <FormattedMessage
        {...attributeValuePasteMessages.pasteProposal}
        values={{ count: values.length }}
      />
    </Text>
    <Text size={2} color="default2">
      {values.join(", ")}
    </Text>
    <Box display="flex" gap={2} justifyContent="flex-end">
      <Button
        data-test-id="attribute-value-paste-keep"
        disabled={disabled}
        onClick={onKeepAsOne}
        variant="secondary"
      >
        <FormattedMessage {...attributeValuePasteMessages.pasteKeep} />
      </Button>
      <Button
        data-test-id="attribute-value-paste-add"
        disabled={disabled}
        onClick={onAdd}
        variant="primary"
      >
        <FormattedMessage {...attributeValuePasteMessages.pasteAdd} />
      </Button>
    </Box>
  </Box>
);
