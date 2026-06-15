import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Button, sprinkles } from "@saleor/macaw-ui-next";
import { ArrowLeft } from "lucide-react";

type Variant = "secondary" | "tertiary";

export const TopNavLink = ({ to, variant = "secondary" }: { to: string; variant?: Variant }) => {
  const navigate = useNavigator();

  return (
    <Button
      className={sprinkles({ marginRight: 3 })}
      icon={<ArrowLeft size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
      variant={variant}
      size="large"
      data-test-id="app-header-back-button"
      onClick={() => navigate(to)}
    />
  );
};
