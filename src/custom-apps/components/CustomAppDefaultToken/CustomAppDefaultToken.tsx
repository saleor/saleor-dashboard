import { Button } from "@dashboard/components/Button";
import Link from "@dashboard/components/Link";
import useClipboard from "@dashboard/hooks/useClipboard";
import { Card, CardContent, Paper, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@saleor/macaw-ui";
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
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.content}>
          <div>
            <Typography>
              <FormattedMessage
                id="ixjvkM"
                defaultMessage="We’ve created your default token. Make sure to copy your new personal access token now. You won’t be able to see it again."
              />
            </Typography>
            <Typography>
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
            </Typography>
          </div>
          <div className={classes.closeContainer}>
            <IconButton variant="secondary" onClick={onTokenClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="caption">
            <FormattedMessage id="Kxiige" defaultMessage="Generated Token" />
          </Typography>
          <Typography>{token}</Typography>
          <Button className={classes.copy} onClick={() => copy(token)}>
            {copied ? (
              <FormattedMessage id="r86alc" defaultMessage="Copied" description="button" />
            ) : (
              <FormattedMessage id="HVFq//" defaultMessage="Copy token" description="button" />
            )}
          </Button>
        </Paper>
      </CardContent>
    </Card>
  );
};

CustomAppDefaultToken.displayName = "CustomAppDefaultToken";
export default CustomAppDefaultToken;
