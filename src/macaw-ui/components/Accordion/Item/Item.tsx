import { Item as AccordionItem } from "@radix-ui/react-accordion";
import { ReactNode } from "react";

import { Box, PropsWithBox } from "~/components/Box";

import { trigger } from "../common.css";

export type AccordionItemProps = PropsWithBox<{
  children: ReactNode;
  value: string;
}>;

export const Item = ({ children, value, ...rest }: AccordionItemProps) => {
  return (
    <AccordionItem value={value} className={trigger} asChild>
      <Box {...rest} data-macaw-ui-component="Accordion.Item">
        {children}
      </Box>
    </AccordionItem>
  );
};

Item.displayName = "Accordion.Item";
