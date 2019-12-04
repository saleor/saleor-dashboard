import { makeStyles } from "@material-ui/core/styles";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles(
  {
    link: {
      textDecoration: "none"
    }
  },
  { name: "ExternalLink" }
);

interface ExternalLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  href: string;
  className?: string;
  typographyProps?: TypographyProps;
}

const ExternalLink: React.FC<ExternalLinkProps> = props => {
  const { className, children, href, typographyProps, ...rest } = props;

  const classes = useStyles(props);

  return (
    <a href={href} className={classes.link} {...rest}>
      <Typography className={className} color="primary" {...typographyProps}>
        {children}
      </Typography>
    </a>
  );
};
ExternalLink.displayName = "ExternalLink";
export default ExternalLink;
