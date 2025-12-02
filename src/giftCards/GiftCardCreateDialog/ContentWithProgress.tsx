import { SaleorThrobber } from "@dashboard/components/Throbber";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import { PropsWithChildren } from "react";

interface ContentWithProgressProps {
  containerClassName?: string;
}

const useStyles = makeStyles(
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

const ContentWithProgress = ({
  containerClassName,
  children,
}: PropsWithChildren<ContentWithProgressProps>) => {
  const classes = useStyles({});

  return children ? (
    <>{children}</>
  ) : (
    <div className={clsx(classes.container, containerClassName)}>
      <SaleorThrobber />
    </div>
  );
};

export default ContentWithProgress;
