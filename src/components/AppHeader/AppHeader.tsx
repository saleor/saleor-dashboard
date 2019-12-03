import Portal from "@material-ui/core/Portal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import AppHeaderContext from "../AppLayout/AppHeaderContext";
import Skeleton from "../Skeleton";

export interface AppHeaderProps {
  children: React.ReactNode;
  onBack();
}

const useStyles = makeStyles(
  theme => ({
    backArrow: {
      fontSize: 30
    },
    menuButton: {
      flex: "0 0 auto",
      marginLeft: -theme.spacing(2),
      marginRight: theme.spacing(),
      marginTop: -theme.spacing(2)
    },
    root: {
      "&:hover": {
        color: theme.typography.body1.color
      },
      alignItems: "center",
      color: theme.palette.grey[500],
      cursor: "pointer",
      display: "flex",
      marginTop: theme.spacing(0.5),
      transition: theme.transitions.duration.standard + "ms",
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    },
    skeleton: {
      marginBottom: theme.spacing(2),
      width: "10rem"
    },
    title: {
      color: "inherit",
      flex: 1,
      marginLeft: theme.spacing(),
      textTransform: "uppercase",
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    }
  }),
  { name: "AppHeader" }
);

const AppHeader: React.FC<AppHeaderProps> = props => {
  const { children, onBack } = props;

  const classes = useStyles(props);

  return (
    <AppHeaderContext.Consumer>
      {anchor =>
        anchor ? (
          <Portal container={anchor.current}>
            <div className={classes.root} onClick={onBack}>
              <ArrowBackIcon className={classes.backArrow} />
              {children ? (
                <Typography className={classes.title}>{children}</Typography>
              ) : (
                <Skeleton className={classes.skeleton} />
              )}
            </div>
          </Portal>
        ) : null
      }
    </AppHeaderContext.Consumer>
  );
};
AppHeader.displayName = "AppHeader";
export default AppHeader;
