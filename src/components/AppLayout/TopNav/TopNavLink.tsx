import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Button, sprinkles } from "@saleor/macaw-ui-next";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type Variant = "secondary" | "tertiary";

export const TopNavLink = ({ to, variant = "secondary" }: { to: string; variant?: Variant }) => (
  <Link to={to} className={sprinkles({ marginRight: 2 })}>
    <Button
      icon={<ArrowLeft size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
      variant={variant}
      size="large"
      data-test-id="app-header-back-button"
    />
  </Link>
);
