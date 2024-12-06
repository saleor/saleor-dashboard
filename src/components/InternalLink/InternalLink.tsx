import clsx from "clsx";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

import { useStyles } from "./styles";

export const InternalLink = ({ className, ...props }: LinkProps) => {
  const classes = useStyles();

  return <Link className={clsx(classes.root, className)} {...props} />;
};

export default InternalLink;
