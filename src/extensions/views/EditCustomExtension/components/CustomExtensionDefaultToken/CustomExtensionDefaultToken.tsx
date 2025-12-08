import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { Mono } from "../TokenCreateDialog/Mono";
import { useClipboardCopy } from "../TokenCreateDialog/useClipboardCopy";

interface CustomExtensionDefaultTokenProps {
  token: string;
  onTokenClose: () => void;
}

export const CustomExtensionDefaultToken = (props: CustomExtensionDefaultTokenProps) => {
  const { token, onTokenClose } = props;
  const { copyToClipboard, copyState } = useClipboardCopy();

  return (
    <DashboardCard boxShadow="defaultModal" position="relative">
      <DashboardCard.Content padding={4}>
        <Box display="flex" flexDirection="row" gap={2}>
          <div>
            <Text>
              <FormattedMessage
                id="ixjvkM"
                defaultMessage="We’ve created your default token. Make sure to copy your new personal access token now. You won’t be able to see it again."
              />
            </Text>
          </div>

          <Button
            icon={<X />}
            variant="tertiary"
            onClick={onTokenClose}
            data-test-id="close-token-button"
          ></Button>
        </Box>

        <Box marginTop={4} backgroundColor="default2" padding={4} borderRadius={8}>
          <Text size={3} fontWeight="medium">
            <FormattedMessage id="Kxiige" defaultMessage="Generated Token" />
          </Text>

          <Mono>{token}</Mono>

          <ConfirmButton
            marginTop={4}
            noTransition
            transitionState={copyState}
            variant="secondary"
            onClick={() => copyToClipboard(token)}
          >
            <FormattedMessage id="HVFq//" defaultMessage="Copy token" description="button" />
          </ConfirmButton>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomExtensionDefaultToken.displayName = "CustomExtensionDefaultToken";
