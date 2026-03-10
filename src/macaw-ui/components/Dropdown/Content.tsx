import { ReactNode } from "react";
import {
  Portal as DropdownMenuPortal,
  Content as DropdownMenuContent,
  DropdownMenuContentProps,
} from "@radix-ui/react-dropdown-menu";

import { content } from "./common.css";

export type DropdownContentProps = {
  children: ReactNode;
  align?: DropdownMenuContentProps["align"];
  side?: DropdownMenuContentProps["side"];
};

export const Content = ({ children, ...rest }: DropdownContentProps) => {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContent
        asChild
        className={content}
        data-macaw-ui-component="Dropdown.Content"
        {...rest}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenuPortal>
  );
};

Content.displayName = "Dropdown.Content";
