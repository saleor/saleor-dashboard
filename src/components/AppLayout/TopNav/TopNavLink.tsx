import { Button, sprinkles } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "secondary" | "tertiary";

interface TopNavLinkProps {
  to: string;
  /** Icon that represents the destination (not a generic back arrow). */
  icon: ReactNode;
  /** Visible tooltip and accessible name for the destination. */
  title: string;
  variant?: Variant;
}

export const TopNavLink = ({ to, icon, title, variant = "secondary" }: TopNavLinkProps) => (
  <Link to={to} className={sprinkles({ marginRight: 3 })}>
    <Button
      icon={icon}
      variant={variant}
      size="large"
      title={title}
      aria-label={title}
      data-test-id="app-header-back-button"
    />
  </Link>
);
