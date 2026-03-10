import { AccordionTrigger } from "@radix-ui/react-accordion";
import { ReactNode } from "react";

import { Box, Button, ChervonDownIcon, PropsWithBox } from "~/components";
import { DataAttributes } from "~/components/types";

import { List } from "..";
import { useItemGroupContext } from "./context";

import { button, icon } from "./common.css";

export type ItemGroupTriggerProps = PropsWithBox<
  DataAttributes & {
    children: ReactNode;
    active?: boolean;
    url?: string;
    size?: "small" | "medium" | "large";
  }
>;

export const Trigger = ({ children, size, ...rest }: ItemGroupTriggerProps) => {
  const { triggerOpen } = useItemGroupContext();

  return (
    // Importing List.Item instead of Item fixes vite HMR
    <List.Item data-macaw-ui-component="ItemGroup.Trigger" {...rest}>
      <Box width="100%" height="100%" onClick={triggerOpen}>
        {children}
      </Box>
      <AccordionTrigger asChild>
        <Button
          icon={
            <ChervonDownIcon className={icon} color="default1" size={size} />
          }
          variant="tertiary"
          size={size}
          className={button}
        />
      </AccordionTrigger>
    </List.Item>
  );
};

Trigger.displayName = "ListItem.Trigger";
