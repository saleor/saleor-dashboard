import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

import notFoundImage from "@assets/images/not-found-404.svg";

const useStyles = makeStyles(
  theme => ({
    button: {
      marginTop: theme.spacing(2),
      padding: 20
    },
    container: {
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        padding: theme.spacing(3),
        width: "100%"
      },
      display: "grid",
      gridTemplateColumns: "1fr 487px",
      margin: "0 auto",
      width: 830
    },
    header: {
      fontWeight: 600 as 600
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
      height: "calc(100vh - 180px)"
    }
  }),
  { name: "NotFoundPage" }
);

interface NotFoundPageProps {
  onBack: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = props => {
  const { onBack } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div>
            <Typography className={classes.header} variant="h3">
              <FormattedMessage defaultMessage="Ooops!..." />
            </Typography>
            <Typography className={classes.header} variant="h4">
              <FormattedMessage defaultMessage="Something's missing" />
            </Typography>
            <Typography>
              <FormattedMessage defaultMessage="Sorry, the page was not found" />
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
                defaultMessage="Go back to dashboard"
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
  );
};
NotFoundPage.displayName = "NotFoundPage";
export default NotFoundPage;
