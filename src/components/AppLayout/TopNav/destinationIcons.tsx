import { createTopNavLucideIcon } from "@dashboard/icons/createNavigationLucideIcon";
import { TopNavModelingIcon } from "@dashboard/icons/Modeling";
import {
  Gift,
  Globe,
  Grid2x2Plus,
  Home,
  Languages,
  Package,
  Percent,
  Receipt,
  Settings,
  Shield,
  Tag,
  Tags,
  Truck,
  User,
  Users,
  Warehouse,
} from "lucide-react";

/**
 * Destination icons for TopNav href links.
 * Prefer these over a generic back arrow so the control shows where it navigates.
 */
export const TopNavDestinationIcon = {
  attributes: createTopNavLucideIcon(Tags),
  channels: createTopNavLucideIcon(Globe),
  configuration: createTopNavLucideIcon(Settings),
  customers: createTopNavLucideIcon(User),
  discounts: createTopNavLucideIcon(Percent),
  extensions: createTopNavLucideIcon(Grid2x2Plus),
  giftCards: createTopNavLucideIcon(Gift),
  home: createTopNavLucideIcon(Home),
  modeling: TopNavModelingIcon,
  orders: createTopNavLucideIcon(Package),
  permissionGroups: createTopNavLucideIcon(Shield),
  products: createTopNavLucideIcon(Tag),
  shipping: createTopNavLucideIcon(Truck),
  staff: createTopNavLucideIcon(Users),
  taxes: createTopNavLucideIcon(Receipt),
  translations: createTopNavLucideIcon(Languages),
  warehouses: createTopNavLucideIcon(Warehouse),
} as const;
