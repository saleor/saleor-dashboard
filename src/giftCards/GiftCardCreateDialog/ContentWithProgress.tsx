import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

interface ContentWithProgressProps {
  containerClassName?: string;
}

export const useStyles = makeStyles(
  theme => ({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      padding: theme.spacing(3),
    },
  }),
  { name: "ContentWithProgress" },
);

const ContentWithProgress: React.FC<ContentWithProgressProps> = ({
  containerClassName,
  children,
}) => {
  const classes = useStyles({});

  return children ? (
    <>{children}</>
  ) : (
    <div className={classNames(classes.container, containerClassName)}>
      <CircularProgress />
    </div>
  );
};

export default ContentWithProgress;
