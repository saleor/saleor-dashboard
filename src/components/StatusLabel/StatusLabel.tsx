import { Typography } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import yellow from "@material-ui/core/colors/yellow";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import classNames from "classnames";
import React from "react";

export const useStyles = makeStyles(
  theme => {
    const dot = {
      borderRadius: "100%",
      height: 8,
      minHeight: 8,
      width: 8,
      minWidth: 8
    };

    return {
      dot,
      container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      },
      containerVertical: {
        alignItems: "flex-start"
      },
      textContainer: {
        marginLeft: theme.spacing(1),
        display: "flex",
        flexDirection: "column"
      },
      dotVertical: {
        marginTop: theme.spacing(1)
      },
      alertDot: {
        backgroundColor: yellow[500],
        ...dot
      },
      errorDot: {
        backgroundColor: theme.palette.error.main,
        ...dot
      },
      neutralDot: {
        backgroundColor: grey[300],
        ...dot
      },
      successDot: {
        backgroundColor: theme.palette.primary.main,
        ...dot
      },
      span: {
        display: "inline"
      }
    };
  },
  { name: "StatusLabel" }
);

export interface StatusLabelProps {
  label: string | React.ReactNode;
  status: "success" | "warning" | "info" | "error" | undefined;
  subtitle?: string;
  className?: string;
}

const StatusLabel: React.FC<StatusLabelProps> = ({
  className,
  label,
  status,
  subtitle
}) => {
  const classes = useStyles({});

  return <Pill color={status} label={label} />;
};

export default StatusLabel;
