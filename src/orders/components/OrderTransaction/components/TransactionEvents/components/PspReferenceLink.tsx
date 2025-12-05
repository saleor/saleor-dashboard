import * as React from "react";

import styles from "./PspReferenceLink.module.css";

interface PspReferenceLinkProps {
  href: string | null | undefined;
  children: React.ReactChild;
}

export const PspReferenceLink = ({ href, children }: PspReferenceLinkProps) => {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {children}
      </a>
    );
  }

  return <>{children}</>;
};
