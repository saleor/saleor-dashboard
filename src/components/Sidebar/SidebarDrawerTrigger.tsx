import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { navigationLucideIconProps } from "@dashboard/components/icons";
import { Menu } from "lucide-react";
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from "react";
import { useIntl } from "react-intl";

import styles from "./SidebarDrawerTrigger.module.css";
import { sidebarDrawerTriggerMessages as messages } from "./sidebarDrawerTriggerMessages";

type SidebarDrawerTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "children">;

export const SidebarDrawerTrigger = forwardRef<HTMLButtonElement, SidebarDrawerTriggerProps>(
  function SidebarDrawerTrigger({ className, style, type = "button", ...props }, ref) {
    const intl = useIntl();
    const triggerStyle: CSSProperties = {
      height: topBarHeight,
      ...style,
    };

    return (
      <button
        ref={ref}
        type={type}
        className={className ? `${styles.trigger} ${className}` : styles.trigger}
        style={triggerStyle}
        data-test-id="sidebar-drawer-open"
        aria-label={intl.formatMessage(messages.openNavigation)}
        {...props}
      >
        <Menu {...navigationLucideIconProps} aria-hidden />
      </button>
    );
  },
);
