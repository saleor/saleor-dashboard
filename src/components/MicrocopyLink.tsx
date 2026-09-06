import { Text } from "@saleor/macaw-ui-next";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MicrocopyLinkProps {
  to: string;
  children: ReactNode;
}

export function MicrocopyLink({ to, children }: MicrocopyLinkProps): React.ReactNode {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Text
        as="span"
        color="inherit"
        fontWeight="medium"
        __fontSize="inherit"
        textDecoration={{ hover: "underline" }}
      >
        {children}
      </Text>
    </Link>
  );
}
