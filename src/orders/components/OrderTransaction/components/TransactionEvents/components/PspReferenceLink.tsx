import { Box } from "@saleor/macaw-ui-next";
import * as React from "react";

interface PspReferenceLinkProps {
  href: string | null | undefined;
  children: React.ReactChild;
}

export const PspReferenceLink = ({ href, children }: PspReferenceLinkProps) => {
  if (href) {
    return (
      <Box
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        textDecoration={{ default: "none", hover: "underline" }}
      >
        {children}
      </Box>
    );
  }

  return <>{children}</>;
};
