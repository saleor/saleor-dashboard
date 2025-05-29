import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import Link from "@dashboard/components/Link";
import { Box, Button, CloseIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { Mono } from "../TokenCreateDialog/Mono";
import { useClipboardCopy } from "../TokenCreateDialog/useClipboardCopy";

export interface CustomExtensionDefaultTokenProps {
  apiUrl: string;
  token: string;
  onApiUrlClick: () => void;
  onTokenClose: () => void;
}

const CustomExtensionDefaultToken: React.FC<CustomExtensionDefaultTokenProps> = props => {
  const { apiUrl, token, onApiUrlClick, onTokenClose } = props;
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
            <Text display="block" marginTop={1}>
              <FormattedMessage
                id="DGCzal"
                defaultMessage="This token gives you access to your shop's API, which you'll find here: {url}"
                values={{
                  url: (
                    <Link href={apiUrl} onClick={onApiUrlClick}>
                      {apiUrl}
                    </Link>
                  ),
                }}
              />
            </Text>
          </div>

          <Button
            icon={<CloseIcon />}
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

CustomExtensionDefaultToken.displayName = "CustomAppDefaultToken";
export default CustomExtensionDefaultToken;
