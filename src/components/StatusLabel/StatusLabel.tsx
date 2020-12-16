import grey from "@material-ui/core/colors/grey";
import yellow from "@material-ui/core/colors/yellow";
import { makeStyles } from "@material-ui/core/styles";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => {
    const dot = {
      borderRadius: "100%",
      content: "''",
      display: "block",
      height: 8,
      left: -theme.spacing(2),
      position: "absolute" as "absolute",
      top: "calc(50% - 5px)",
      width: 8
    };

    return {
      alertDot: {
        "&:before": { backgroundColor: yellow[500], ...dot }
      },
      errorDot: {
        "&:before": { backgroundColor: theme.palette.error.main, ...dot }
      },
      neutralDot: {
        "&:before": { backgroundColor: grey[300], ...dot }
      },
      root: {
        display: "inline-block",
        marginLeft: theme.spacing(1) + 8,
        position: "relative"
      },
      span: {
        display: "inline"
      },
      successDot: {
        "&:before": { backgroundColor: theme.palette.primary.main, ...dot }
      }
    };
  },
  { name: "StatusLabel" }
);

interface StatusLabelProps {
  className?: string;
  label: string | React.ReactNode;
  status: "success" | "alert" | "neutral" | "error" | string;
  typographyProps?: TypographyProps;
}

const StatusLabel: React.FC<StatusLabelProps> = props => {
  const { className, label, status, typographyProps } = props;

  const classes = useStyles(props);

  return (
    <div
      className={classNames({
        [classes.root]: true,
        [className]: true,
        [classes.successDot]: status === "success",
        [classes.alertDot]: status === "alert",
        [classes.neutralDot]: status === "neutral",
        [classes.errorDot]: status === "error"
      })}
    >
      {typographyProps ? (
        <Typography
          component="span"
          className={classes.span}
          {...typographyProps}
        >
          {label}
        </Typography>
      ) : (
        label
      )}
    </div>
  );
};
StatusLabel.displayName = "StatusLabel";
export default StatusLabel;
