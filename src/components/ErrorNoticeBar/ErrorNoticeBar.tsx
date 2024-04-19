import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

interface ErrorNoticeBarProps {
  className?: string;
  message: string | React.ReactNode;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      background: theme.palette.alert.paper.error,
    },
  }),
  {
    name: "ErrorNoticeBar",
  },
);
const ErrorNoticeBar: React.FC<ErrorNoticeBarProps> = props => {
  const { className, message } = props;
  const classes = useStyles(props);

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <Typography variant="body1">{message}</Typography>
      </CardContent>
    </Card>
  );
};

ErrorNoticeBar.displayName = "ErrorNoticeBar";
export default ErrorNoticeBar;
