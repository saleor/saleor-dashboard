import { Text, TextProps } from "@saleor/macaw-ui-next";
import { Link, LinkProps } from "react-router-dom";

interface UnderlineLinkProps extends LinkProps {
  textProps?: Omit<TextProps, "children">;
}

export const UnderlineLink = ({
  children,
  textProps,
  ...props
}: UnderlineLinkProps): JSX.Element => (
  <Link {...props}>
    <UnderlineText {...textProps}>{children}</UnderlineText>
  </Link>
);

const UnderlineText = ({ children, ...props }: TextProps): JSX.Element => (
  <Text
    as="span"
    textDecoration="underline"
    fontWeight="medium"
    size={2}
    data-macaw-ui-candidate
    {...props}
  >
    {children}
  </Text>
);
