import alertIconDark from "@assets/images/alert-dark.svg";
import alertIcon from "@assets/images/alert.svg";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { useTheme } from "@saleor/macaw-ui";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";

const useStyles = makeStyles(
  theme => ({
    close: {
      color: theme.palette.common.black,
      position: "absolute",
      right: theme.spacing(-1),
      top: theme.spacing(-2)
    },
    content: {
      color: theme.palette.getContrastText(theme.palette.alert.paper.warning),
      columnGap: theme.spacing(2),
      display: "grid",
      gridTemplateColumns: "40px 1fr"
    },
    icon: {
      color: theme.palette.alert.icon.warning
    },
    root: {
      background: theme.palette.alert.paper.warning,
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
  className?: string;
  show: boolean;
  title: string;
}

const Alert: React.FC<AlertProps> = ({ children, className, show, title }) => {
  const classes = useStyles({});
  const [visible, setVisible] = useStateFromProps(show);
  const { isDark } = useTheme();

  return visible ? (
    <Card elevation={0} className={classNames(classes.root, className)}>
      <CardContent>
        <div className={classes.content}>
          <div>
            <SVG
              className={classes.icon}
              src={isDark ? alertIconDark : alertIcon}
            />
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
