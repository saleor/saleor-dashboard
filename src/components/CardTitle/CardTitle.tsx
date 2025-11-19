import { CardHeader } from "@material-ui/core";
import { vars } from "@saleor/macaw-ui-next";
import * as React from "react";

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
  onClose?: () => void;
}

const CardTitle = ({ className, children, title, subtitle, toolbar, ...rest }: CardTitleProps) => (
  <CardHeader
    action={toolbar}
    className={className}
    title={title}
    subheader={subtitle}
    {...rest}
    // TODO: don't add this color if status is unfulfilled
    style={{ backgroundColor: vars.colors.background.default2 }}
  >
    {children}
  </CardHeader>
);

// TODO: remove
CardTitle.displayName = "CardTitle";
export default CardTitle;
