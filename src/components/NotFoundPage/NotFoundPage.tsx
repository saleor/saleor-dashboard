import notFoundImage from "@assets/images/not-found-404.svg";
import { Button } from "@dashboard/components/Button";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    button: {
      marginTop: theme.spacing(2),
      padding: 20,
    },
    container: {
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        padding: theme.spacing(3),
        width: "100%",
      },
      display: "grid",
      gridTemplateColumns: "1fr 487px",
      margin: "0 auto",
      width: 830,
    },
    header: {
      fontWeight: 600 as const,
    },
    innerContainer: {
      [theme.breakpoints.down("sm")]: {
        order: 1,
        textAlign: "center",
      },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    notFoundImage: {
      "& svg": {
        width: "100%",
      },
    },
    root: {
      alignItems: "center",
      display: "flex",
      height: "100vh",
    },
  }),
  { name: "NotFoundPage" },
);

type NotFoundPageProps =
  | {
      onBack: () => void;
      backHref?: never;
    }
  | {
      onBack?: never;
      backHref: string;
    };

const NotFoundPage = (props: NotFoundPageProps) => {
  const { onBack, backHref } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div>
            <Text className={classes.header} size={6} fontWeight="bold" lineHeight={3}>
              <FormattedMessage id="yH56V+" defaultMessage="Ooops!..." />
            </Text>
            <Text
              className={classes.header}
              size={4}
              fontWeight="bold"
              lineHeight={2}
              display="block"
            >
              <FormattedMessage id="bj6pTd" defaultMessage="Something's missing" />
            </Text>
            <Text display="block">
              <FormattedMessage id="nRiOg+" defaultMessage="Sorry, the page was not found" />
            </Text>
          </div>
          <div>
            <Button className={classes.button} variant="primary" onClick={onBack} href={backHref}>
              <FormattedMessage
                id="95oJ5d"
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
