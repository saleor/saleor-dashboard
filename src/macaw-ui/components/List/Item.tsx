import { forwardRef, ReactNode } from "react";

import { Box, PropsWithBox } from "../Box";

export type ListItemProps = PropsWithBox<{
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  active?: boolean;
}>;

export const Item = forwardRef<HTMLElement, ListItemProps>(
  ({ children, disabled, onClick, className, active, ...rest }, ref) => {
    return (
      <Box
        as="li"
        display="flex"
        alignItems="center"
        cursor={{ default: "pointer", disabled: "not-allowed" }}
        disabled={disabled}
        backgroundColor={{
          default: active ? "default1Focused" : "transparent",
          active: "default1Pressed",
          hover: "default1Hovered",
          focus: "default1Focused",
        }}
        onClick={onClick}
        className={className}
        ref={ref}
        data-macaw-ui-component="List.Item"
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

Item.displayName = "List.Item";
