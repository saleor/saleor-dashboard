import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Button, type ButtonProps, type PropsWithBox } from "@saleor/macaw-ui-next";
import { Plus } from "lucide-react";

import { useFilterContext } from "./context";
import styles from "./Footer.module.css";
import { type ConditionalFiltersLayout } from "./Root";

export const Footer = ({
  children,
  layout = "popover",
  ...props
}: PropsWithBox<{ layout?: ConditionalFiltersLayout }>) => {
  if (layout === "panel") {
    return (
      <Box className={styles.panelFooter} {...props}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={3}
      paddingTop={1}
      flexWrap="wrap"
      {...props}
    >
      {children}
    </Box>
  );
};

export const AddRowButton = ({ children, ...props }: ButtonProps) => {
  const { emitter } = useFilterContext();

  return (
    <Button
      onClick={() => emitter.addRow()}
      variant="secondary"
      icon={<Plus size={iconSize.small} strokeWidth={iconStrokeWidth} />}
      {...props}
    >
      {children}
    </Button>
  );
};

export const ClearButton = ({ children, disabled, ...props }: ButtonProps) => {
  const { actionButtonsDisabled } = useFilterContext();

  return (
    <Button variant="secondary" disabled={disabled ?? actionButtonsDisabled} {...props}>
      {children}
    </Button>
  );
};

export const CloseButton = ({ children, ...props }: ButtonProps): JSX.Element => (
  <Button variant="tertiary" {...props}>
    {children}
  </Button>
);

export const ConfirmButton = ({ children, ...props }: ButtonProps) => {
  const { actionButtonsDisabled } = useFilterContext();

  return (
    <Button variant="primary" disabled={actionButtonsDisabled} {...props}>
      {children}
    </Button>
  );
};
