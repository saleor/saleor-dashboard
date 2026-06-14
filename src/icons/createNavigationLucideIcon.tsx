import { navigationLucideIconProps } from "@dashboard/components/icons";
import { type LucideIcon } from "lucide-react";

export const createNavigationLucideIcon = (Icon: LucideIcon): (() => JSX.Element) => {
  const NavigationLucideIcon = (): JSX.Element => <Icon {...navigationLucideIconProps} />;

  return NavigationLucideIcon;
};
