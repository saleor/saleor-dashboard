import { makeStyles } from "@saleor/macaw-ui";
import { ReactChild } from "react";

interface PspRerefenceLinkProps {
  href: string | null;
  children: ReactChild;
}

const useStyles = makeStyles(
  theme => ({
    link: {
      color: theme.palette.saleor.active[1],
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
