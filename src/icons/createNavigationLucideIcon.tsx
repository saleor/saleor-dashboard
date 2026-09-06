import {
  configurationLucideIconProps,
  navigationLucideIconProps,
  topNavLucideIconProps,
} from "@dashboard/components/icons";
import { type LucideIcon } from "lucide-react";

export const createNavigationLucideIcon = (Icon: LucideIcon): (() => React.ReactNode) => {
  const NavigationLucideIcon = (): React.ReactNode => <Icon {...navigationLucideIconProps} />;

  return NavigationLucideIcon;
};

export const createConfigurationLucideIcon = (Icon: LucideIcon): (() => React.ReactNode) => {
  const ConfigurationLucideIcon = (): React.ReactNode => <Icon {...configurationLucideIconProps} />;

  return ConfigurationLucideIcon;
};

export const createTopNavLucideIcon = (Icon: LucideIcon): (() => React.ReactNode) => {
  const TopNavLucideIcon = (): React.ReactNode => <Icon {...topNavLucideIconProps} />;

  return TopNavLucideIcon;
};
