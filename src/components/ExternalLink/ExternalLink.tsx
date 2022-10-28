import { Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  {
    link: {
      textDecoration: "none",
    },
  },
  { name: "ExternalLink" },
);

interface ExternalLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  typographyProps?: TypographyProps;
}

const ExternalLink: React.FC<ExternalLinkProps> = props => {
  const {
    className,
    children,
    href,
    typographyProps,
    target,
    rel,
    ...rest
  } = props;

  const classes = useStyles(props);

  const opensNewTab = target === "_blank";

  return (
    <a
      href={href}
      className={classes.link}
      target={target}
      rel={rel ?? opensNewTab ? "noopener noreferer" : ""}
      {...rest}
    >
      <Typography className={className} color="primary" {...typographyProps}>
        {children}
      </Typography>
    </a>
  );
};
ExternalLink.displayName = "ExternalLink";
export default ExternalLink;
