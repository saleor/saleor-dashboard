import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Link from "@saleor/components/Link";
import useClipboard from "@saleor/hooks/useClipboard";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface ServiceDefaultTokenProps {
  apiUri: string;
  token: string;
  onApiUriClick: () => void;
  onTokenClose: () => void;
}

const useStyles = makeStyles(
  theme => ({
    cancel: {
      marginRight: theme.spacing(1)
    },
    closeContainer: {
      display: "flex",
      justifyContent: "flex-end",
      position: "relative",
      right: -theme.spacing(),
      top: -theme.spacing(1)
    },
    content: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "1fr 60px",
      marginBottom: theme.spacing(3)
    },
    copy: {
      marginTop: theme.spacing(),
      position: "relative",
      right: theme.spacing(1)
    },
    paper: {
      background: fade(theme.palette.primary.main, 0.05),
      padding: theme.spacing(2, 3)
    },
    root: {
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)"
    }
  }),
  {
    name: "ServiceTokenCreateDialog"
  }
);

const ServiceDefaultToken: React.FC<ServiceDefaultTokenProps> = props => {
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

ServiceDefaultToken.displayName = "ServiceDefaultToken";
export default ServiceDefaultToken;
