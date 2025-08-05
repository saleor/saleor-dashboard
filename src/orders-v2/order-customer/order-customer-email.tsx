import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { ClipboardCopyIcon } from "../clipboard-copy-icon";

export const OrderCustomerEmail = ({ userEmail }: { userEmail: string }) => {
  const [copied, copy] = useClipboard();

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <Text>{userEmail}</Text>
      <Button
        variant="tertiary"
        size="small"
        icon={<ClipboardCopyIcon hasBeenClicked={copied} />}
        onClick={() => copy(userEmail)}
      />
    </Box>
  );
};
