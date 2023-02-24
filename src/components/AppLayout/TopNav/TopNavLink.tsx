import { ArrowLeftIcon, Button } from "@saleor/macaw-ui/next";
import React from "react";
import { Link } from "react-router-dom";

export const TopNavLink: React.FC<{ to: string }> = ({ to }) => (
  <Link to={to}>
    <Button
      icon={<ArrowLeftIcon />}
      variant="secondary"
      size="large"
      data-test-id="app-header-back-button"
    />
  </Link>
);
