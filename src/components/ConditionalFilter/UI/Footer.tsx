import { Box, Button, ButtonProps, PropsWithBox } from "@saleor/macaw-ui-next";

import { useFilterContext } from "./context";

export const Footer = ({ children, ...props }: PropsWithBox<unknown>) => (
  <Box display="flex" justifyContent="space-between" paddingTop={1} {...props}>
    {children}
  </Box>
);

export const AddRowButton = ({ children, ...props }: ButtonProps) => {
  const { emitter } = useFilterContext();

  return (
    <Button onClick={() => emitter.addRow()} variant="secondary" {...props}>
      {children}
    </Button>
  );
};

export const ClearButton = ({ children, ...props }: ButtonProps) => {
  const { actionButtonsDisabled } = useFilterContext();

  return (
    <Button variant="secondary" disabled={actionButtonsDisabled} {...props}>
      {children}
    </Button>
  );
};

export const ConfirmButton = ({ children, ...props }: ButtonProps) => {
  const { actionButtonsDisabled } = useFilterContext();

  return (
    <Button variant="primary" disabled={actionButtonsDisabled} {...props}>
      {children}
    </Button>
  );
};
