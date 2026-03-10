import { Content as AccordionContent } from "@radix-ui/react-accordion";
import { ReactNode } from "react";

import { Box, PropsWithBox } from "~/components/Box";
import { content } from "../common.css";

export type AccordionContentProps = PropsWithBox<{
  children: ReactNode;
}>;

export const Content = ({ children, ...rest }: AccordionContentProps) => (
  <AccordionContent asChild className={content}>
    <Box {...rest} data-macaw-ui-component="Accordion.Content">
      {children}
    </Box>
  </AccordionContent>
);

Content.displayName = "Accordion.Content";
