import React from "react";

import { useDataLineStyles } from "../styles";

interface DataLineProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export const DataLine: React.FC<DataLineProps> = ({ label, children }) => {
  const classes = useDataLineStyles();

  return (
    <li>
      <dl className={classes.wrapper}>
        <dt>{label}</dt>
        <dd>{children}</dd>
      </dl>
    </li>
  );
};
