import { navigationLucideIconProps } from "@dashboard/components/icons";
import { type LucideIcon } from "lucide-react";

export const createNavigationLucideIcon = (Icon: LucideIcon) => {
  const NavigationLucideIcon = () => <Icon {...navigationLucideIconProps} />;

  return NavigationLucideIcon;
};
