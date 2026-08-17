import { createTopNavLucideIcon } from "@dashboard/icons/createNavigationLucideIcon";
import { TopNavModelingIcon } from "@dashboard/icons/Modeling";
import {
  FolderTree,
  Gift,
  Globe,
  Grid2x2Plus,
  Home,
  Languages,
  Layers,
  Package,
  Percent,
  Receipt,
  Settings,
  Shapes,
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
 *
 * Catalog destinations stay distinct:
 * - products → Tag (SKU / sellable item)
 * - product types → Shapes (circle + square + triangle)
 * - categories → FolderTree (taxonomy)
 * - collections → Layers (curated grouping)
 */
export const TopNavDestinationIcon = {
  attributes: createTopNavLucideIcon(Tags),
  categories: createTopNavLucideIcon(FolderTree),
  channels: createTopNavLucideIcon(Globe),
  collections: createTopNavLucideIcon(Layers),
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
  productTypes: createTopNavLucideIcon(Shapes),
  shipping: createTopNavLucideIcon(Truck),
  staff: createTopNavLucideIcon(Users),
  taxes: createTopNavLucideIcon(Receipt),
  translations: createTopNavLucideIcon(Languages),
  warehouses: createTopNavLucideIcon(Warehouse),
} as const;
