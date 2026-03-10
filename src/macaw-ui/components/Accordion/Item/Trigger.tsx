import {
  Header as AccordionHeader,
  Trigger as AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ReactNode } from "react";

import { Box, PropsWithBox } from "../../Box";

export type AccordionTriggerProps = PropsWithBox<{
  children: ReactNode;
  buttonDataTestId?: string;
}>;

export const Trigger = ({
  children,
  disabled,
  ...rest
}: AccordionTriggerProps) => (
  <AccordionHeader asChild>
    <AccordionTrigger
      asChild
      onClick={(e) => {
        disabled && e.preventDefault();
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        gap={2}
        alignItems="center"
        cursor={disabled ? "not-allowed" : "pointer"}
        disabled={disabled}
        {...rest}
        data-macaw-ui-component="Accordion.Trigger"
      >
        {children}
      </Box>
    </AccordionTrigger>
  </AccordionHeader>
);

Trigger.displayName = "Accordion.Trigger";
