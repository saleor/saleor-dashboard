import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Link from "@saleor/components/Link";
import useClipboard from "@saleor/hooks/useClipboard";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export interface CustomAppDefaultTokenProps {
  apiUri: string;
  token: string;
  onApiUriClick: () => void;
  onTokenClose: () => void;
}

const CustomAppDefaultToken: React.FC<CustomAppDefaultTokenProps> = props => {
  const { apiUri, token, onApiUriClick, onTokenClose } = props;
  const classes = useStyles(props);
  const [copied, copy] = useClipboard();

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.content}>
          <div>
            <Typography>
              <FormattedMessage defaultMessage="We’ve created your default token. Make sure to copy your new personal access token now. You won’t be able to see it again." />
            </Typography>
            <Typography>
              <FormattedMessage
                defaultMessage="This token gives you access to your shop's API, which you'll find here: {url}"
                values={{
                  url: (
                    <Link href={apiUri} onClick={onApiUriClick}>
                      {apiUri}
                    </Link>
                  )
                }}
              />
            </Typography>
          </div>
          <div className={classes.closeContainer}>
            <IconButton onClick={onTokenClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="caption">
            <FormattedMessage defaultMessage="Generated Token" />
          </Typography>
          <Typography>{token}</Typography>
          <Button
            className={classes.copy}
            color="primary"
            onClick={() => copy(token)}
          >
            {copied ? (
              <FormattedMessage defaultMessage="Copied" description="button" />
            ) : (
              <FormattedMessage
                defaultMessage="Copy token"
                description="button"
              />
            )}
          </Button>
        </Paper>
      </CardContent>
    </Card>
  );
};

CustomAppDefaultToken.displayName = "CustomAppDefaultToken";
export default CustomAppDefaultToken;
