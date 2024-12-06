import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import useClipboard from "@dashboard/hooks/useClipboard";
import CloseIcon from "@material-ui/icons/Close";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { Mono } from "../TokenCreateDialog/Mono";

export interface CustomAppDefaultTokenProps {
  apiUrl: string;
  token: string;
  onApiUrlClick: () => void;
  onTokenClose: () => void;
}

const CustomAppDefaultToken = (props: CustomAppDefaultTokenProps) => {
  const { apiUrl, token, onApiUrlClick, onTokenClose } = props;
  const [copied, copy] = useClipboard();

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
            <Text display="block">
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

          <Button variant="secondary" onClick={onTokenClose}>
            <CloseIcon />
          </Button>
        </Box>

        <Box marginTop={4} backgroundColor="default2" padding={4} borderRadius={8}>
          <Text size={3} fontWeight="medium">
            <FormattedMessage id="Kxiige" defaultMessage="Generated Token" />
          </Text>

          <Mono>{token}</Mono>

          <Button marginTop={4} variant="secondary" onClick={() => copy(token)}>
            {copied ? (
              <FormattedMessage id="r86alc" defaultMessage="Copied" description="button" />
            ) : (
              <FormattedMessage id="HVFq//" defaultMessage="Copy token" description="button" />
            )}
          </Button>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomAppDefaultToken.displayName = "CustomAppDefaultToken";
export default CustomAppDefaultToken;
