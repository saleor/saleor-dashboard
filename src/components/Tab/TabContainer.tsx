import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import { ReactNode } from "react";

export interface TabContainerProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }),
  { name: "TabContainer" },
);
const TabContainer = (props: TabContainerProps) => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={clsx(classes.root, props.className)}>{children}</div>;
};

TabContainer.displayName = "TabContainer";

export default TabContainer;
