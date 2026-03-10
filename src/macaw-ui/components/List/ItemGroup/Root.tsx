import { ReactNode, useState } from "react";
import {
  Root as AccordionRoot,
  Item as AccordionItem,
} from "@radix-ui/react-accordion";

import { DataAttributes } from "~/components/types";
import { List } from "../List";
import { Provider } from "./context";

import { trigger } from "./common.css";

export type ItemGroupRootProps = DataAttributes & {
  children: ReactNode;
  defaultExpanded?: boolean;
  as?: "ul" | "ol";
};

const expandedValue = "list-item-group-value";

export const ItemGroupRoot = ({
  children,
  defaultExpanded = false,
  as = "ul",
  ...rest
}: ItemGroupRootProps) => {
  const [value, setValue] = useState(defaultExpanded ? expandedValue : "");

  return (
    <AccordionRoot
      asChild
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
    >
      <Provider value={{ triggerOpen: () => setValue(expandedValue) }}>
        <List as={as} {...rest} data-macaw-ui-component="ListItem">
          <AccordionItem value={expandedValue} className={trigger}>
            {children}
          </AccordionItem>
        </List>
      </Provider>
    </AccordionRoot>
  );
};

ItemGroupRoot.displayName = "ListItem";
