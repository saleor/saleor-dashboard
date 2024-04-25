import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

interface PspRerefenceLinkProps {
  href: string | null;
  children: React.ReactChild;
}

const useStyles = makeStyles(
  theme => ({
    link: {
      color: theme.palette.saleor.active[1],
    },
  }),
  { name: "PspReferenceLink" },
);

export const PspReferenceLink: React.FC<PspRerefenceLinkProps> = ({ href, children }) => {
  const classes = useStyles();

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes.link}>
        {children}
      </a>
    );
  }

  return <>{children}</>;
};
