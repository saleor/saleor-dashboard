import { AccordionContent } from "@radix-ui/react-accordion";
import { ReactNode } from "react";

export const Content = ({ children }: { children: ReactNode }) => {
  return (
    <AccordionContent asChild data-macaw-ui-component="ListItem.Content">
      {children}
    </AccordionContent>
  );
};

Content.displayName = "ListItem.Content";
