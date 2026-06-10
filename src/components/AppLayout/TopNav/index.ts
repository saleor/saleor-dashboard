import { Menu } from "./Menu";
import { MetadataButton } from "./MetadataButton";
import { Root } from "./Root";

export * from "./TopNavLink";
export * from "./TopNavWrapper";

export const TopNav = Object.assign(Root, {
  Menu,
  MetadataButton,
});
