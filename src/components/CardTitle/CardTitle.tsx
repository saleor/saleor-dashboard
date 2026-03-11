import { CardHeader } from "@material-ui/core";
import { vars } from "@macaw-ui";
import type * as React from "react";

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
  onClose?: () => void;
  backgroundColor?: keyof typeof vars.colors.background;
}

export const CardTitle = ({
  className,
  children,
  title,
  subtitle,
  toolbar,
  backgroundColor = "default1",
  ...rest
}: CardTitleProps) => (
  <CardHeader
    action={toolbar}
    className={className}
    title={title}
    subheader={subtitle}
    {...rest}
    style={{
      backgroundColor: vars.colors.background[backgroundColor] as string,
      paddingBottom: "13px",
    }}
  >
    {children}
  </CardHeader>
);
