import React from "react";

interface PspRerefenceLinkProps {
  href: string | null;
  children: React.ReactChild;
}

export const PspReferenceLink: React.FC<PspRerefenceLinkProps> = ({
  href,
  children,
}) => {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferer">
        {children}
      </a>
    );
  }

  return <>{children}</>;
};
