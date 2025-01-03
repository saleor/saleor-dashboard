import { ArrowLeftIcon, Button, sprinkles } from "@saleor/macaw-ui-next";
import { Link } from "react-router-dom";

type Variant = "secondary" | "tertiary";

export const TopNavLink = ({ to, variant = "secondary" }: { to: string; variant?: Variant }) => (
  <Link to={to} className={sprinkles({ marginRight: 2 })}>
    <Button
      icon={<ArrowLeftIcon />}
      variant={variant}
      size="large"
      data-test-id="app-header-back-button"
    />
  </Link>
);
