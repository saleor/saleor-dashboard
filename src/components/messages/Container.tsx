import React from "react";

import { useStyles } from "./styles";

const Container = ({ children }: { children: React.ReactNode[] }) => {
  const classes = useStyles({});

  return !!children.length && <div className={classes.container}>{children}</div>;
};

export default Container;
