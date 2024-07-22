import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import useClipboard from "@dashboard/hooks/useClipboard";
import { Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export interface CustomAppDefaultTokenProps {
  apiUrl: string;
  token: string;
  onApiUrlClick: () => void;
  onTokenClose: () => void;
}

const CustomAppDefaultToken: React.FC<CustomAppDefaultTokenProps> = props => {
  const { apiUrl, token, onApiUrlClick, onTokenClose } = props;
  const classes = useStyles(props);
  const [copied, copy] = useClipboard();

  return (
    <DashboardCard className={classes.root}>
      <DashboardCard.Content>
        <div className={classes.content}>
          <div>
            <Text>
              <FormattedMessage
                id="ixjvkM"
                defaultMessage="We’ve created your default token. Make sure to copy your new personal access token now. You won’t be able to see it again."
              />
            </Text>
            <Text>
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
          <div className={classes.closeContainer}>
            <IconButton variant="secondary" onClick={onTokenClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Paper className={classes.paper} elevation={0}>
          <Text size={2} fontWeight="light">
            <FormattedMessage id="Kxiige" defaultMessage="Generated Token" />
          </Text>
          <Text>{token}</Text>
          <Button className={classes.copy} onClick={() => copy(token)}>
            {copied ? (
              <FormattedMessage id="r86alc" defaultMessage="Copied" description="button" />
            ) : (
              <FormattedMessage id="HVFq//" defaultMessage="Copy token" description="button" />
            )}
          </Button>
        </Paper>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomAppDefaultToken.displayName = "CustomAppDefaultToken";
export default CustomAppDefaultToken;
