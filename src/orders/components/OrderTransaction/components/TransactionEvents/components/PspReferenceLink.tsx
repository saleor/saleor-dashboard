import { makeStyles } from "@saleor/macaw-ui";
import * as React from "react";

interface PspRerefenceLinkProps {
  href: string | null | undefined;
  children: React.ReactChild;
}

const useStyles = makeStyles(
  () => ({
    link: {
      color: "inherit",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  }),
  { name: "PspReferenceLink" },
);

export const PspReferenceLink = ({ href, children }: PspRerefenceLinkProps) => {
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
