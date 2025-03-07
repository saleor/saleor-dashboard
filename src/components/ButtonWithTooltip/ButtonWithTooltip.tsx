import { Button, ButtonProps, Tooltip } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

interface ButtonWithTooltipProps extends ButtonProps {
  tooltip?: ReactNode;
  children: ReactNode;
}

export const ButtonWithTooltip = ({ tooltip, children, ...props }: ButtonWithTooltipProps) => {
  if (!tooltip) {
    return <Button {...props}>{children}</Button>;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button {...props}>{children}</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  );
};
