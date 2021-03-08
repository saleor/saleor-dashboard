import alertIcon from "@assets/images/alert.svg";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import React from "react";
import SVG from "react-inlinesvg";

const useStyles = makeStyles(
  theme => ({
    close: {
      position: "absolute",
      right: theme.spacing(-1),
      top: theme.spacing(-2)
    },
    content: {
      columnGap: theme.spacing(2) + "px",
      display: "grid",
      gridTemplateColumns: "40px 1fr"
    },
    root: {
      background: "#FFF4E4",
      marginBottom: theme.spacing(3)
    },
    titleBar: {
      margin: theme.spacing(1, 0),
      position: "relative"
    }
  }),
  { name: "Alert" }
);

export interface AlertProps {
  show: boolean;
  title: string;
}

const Alert: React.FC<AlertProps> = ({ children, show, title }) => {
  const classes = useStyles({});
  const [visible, setVisible] = useStateFromProps(show);

  return visible ? (
    <Card elevation={0} className={classes.root}>
      <CardContent>
        <div className={classes.content}>
          <div>
            <SVG src={alertIcon} />
          </div>
          <div>
            <div className={classes.titleBar}>
              <Typography variant="h5">{title}</Typography>
              <IconButton
                className={classes.close}
                onClick={() => setVisible(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;
};

Alert.displayName = "Alert";
export default Alert;
