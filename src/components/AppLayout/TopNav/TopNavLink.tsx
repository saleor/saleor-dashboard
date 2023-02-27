import { ArrowLeftIcon, Button } from "@saleor/macaw-ui/next";
import React from "react";
import { Link } from "react-router-dom";

export const TopNavLink: React.FC<{
  to: string;
  variant?: "secondary" | "tertiary";
}> = ({ to, variant = "secondary" }) => (
  <Link to={to}>
    <Button
      icon={<ArrowLeftIcon />}
      variant={variant}
      size="large"
      data-test-id="app-header-back-button"
    />
  </Link>
);
