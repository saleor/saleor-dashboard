import { Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
import { makeStyles } from "@saleor/macaw-ui";
import { Text, TextProps } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

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

/**
 * @deprecated use ExternalLinkNext
 */
const ExternalLink: React.FC<ExternalLinkProps> = props => {
  const { className, children, href, typographyProps, target, rel, ...rest } = props;
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

export const ExternalLinkNext = (
  props: TextProps & Omit<HTMLAttributes<HTMLAnchorElement>, "children">,
) => {
  const opensNewTab = props.target === "_blank";

  return (
    <Text
      {...props}
      as="a"
      rel={props.rel ?? opensNewTab ? "noopener noreferer" : ""}
      textDecoration="none"
    />
  );
};
