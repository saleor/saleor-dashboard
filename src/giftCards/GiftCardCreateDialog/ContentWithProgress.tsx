import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import { ReactNode } from "react";

interface ContentWithProgressProps {
  containerClassName?: string;
  children: ReactNode;
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

const ContentWithProgress = ({ containerClassName, children }: ContentWithProgressProps) => {
  const classes = useStyles({});

  return children ? (
    <>{children}</>
  ) : (
    <div className={clsx(classes.container, containerClassName)}>
      <CircularProgress />
    </div>
  );
};

export default ContentWithProgress;
