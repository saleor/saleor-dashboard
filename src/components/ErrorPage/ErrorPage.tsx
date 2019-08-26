import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import notFoundImage from "@assets/images/what.svg";

export interface ErrorPageProps extends WithStyles<typeof styles> {
  onBack: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    bottomHeader: {
      fontWeight: 600 as 600,
      textTransform: "uppercase"
    },
    button: {
      marginTop: theme.spacing.unit * 2,
      padding: 20
    },
    container: {
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        padding: theme.spacing.unit * 3,
        width: "100%"
      },
      display: "grid",
      gridTemplateColumns: "1fr 487px",
      margin: "0 auto",
      width: 830
    },
    innerContainer: {
      [theme.breakpoints.down("sm")]: {
        order: 1,
        textAlign: "center"
      },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    notFoundImage: {
      "& svg": {
        width: "100%"
      }
    },
    root: {
      alignItems: "center",
      display: "flex",
      height: "calc(100vh - 88px)"
    },
    upperHeader: {
      fontWeight: 600 as 600
    }
  });

const ErrorPage = withStyles(styles, { name: "NotFoundPage" })(
  ({ classes, onBack }: ErrorPageProps) => (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div>
            <Typography className={classes.upperHeader} variant="h4">
              <FormattedMessage defaultMessage="Ooops!..." />
            </Typography>
            <Typography className={classes.bottomHeader} variant="h3">
              <FormattedMessage defaultMessage="Error" />
            </Typography>
            <Typography>
              <FormattedMessage defaultMessage="We've encountered a problem..." />
            </Typography>
            <Typography>
              <FormattedMessage defaultMessage="Don't worry, everything is gonna be fine" />
            </Typography>
          </div>
          <div>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={onBack}
            >
              <FormattedMessage
                defaultMessage="Back to home"
                description="button"
              />
            </Button>
          </div>
        </div>
        <div>
          <SVG className={classes.notFoundImage} src={notFoundImage} />
        </div>
      </div>
    </div>
  )
);
ErrorPage.displayName = "ErrorPage";
export default ErrorPage;
