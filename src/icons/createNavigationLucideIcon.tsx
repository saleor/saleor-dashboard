import {
  configurationLucideIconProps,
  navigationLucideIconProps,
} from "@dashboard/components/icons";
import { type LucideIcon } from "lucide-react";

export const createNavigationLucideIcon = (Icon: LucideIcon): (() => JSX.Element) => {
  const NavigationLucideIcon = (): JSX.Element => <Icon {...navigationLucideIconProps} />;

  return NavigationLucideIcon;
};

export const createConfigurationLucideIcon = (Icon: LucideIcon): (() => JSX.Element) => {
  const ConfigurationLucideIcon = (): JSX.Element => <Icon {...configurationLucideIconProps} />;

  return ConfigurationLucideIcon;
};
