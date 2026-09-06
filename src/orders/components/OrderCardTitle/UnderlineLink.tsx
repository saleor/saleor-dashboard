import { Text, type TextProps } from "@saleor/macaw-ui-next";
import { Link, type LinkProps } from "react-router-dom";

interface UnderlineLinkProps extends LinkProps {
  textProps?: Omit<TextProps, "children">;
}

export const UnderlineLink = ({
  children,
  textProps,
  ...props
}: UnderlineLinkProps): React.ReactNode => (
  <Link {...props}>
    <UnderlineText {...textProps}>{children}</UnderlineText>
  </Link>
);

const UnderlineText = ({ children, ...props }: TextProps): React.ReactNode => (
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
