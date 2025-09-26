import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Box, BoxProps, Button, Text } from "@saleor/macaw-ui-next";

import { ClipboardCopyIcon } from "../clipboard-copy-icon";

interface Props extends BoxProps {
  userEmail: string;
}

export const OrderCustomerEmail = ({ userEmail, ...props }: Props) => {
  const [copied, copy] = useClipboard();

  return (
    <Box display="flex" alignItems="center" gap={3} {...props}>
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
