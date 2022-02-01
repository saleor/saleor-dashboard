import { CardHeader } from "@material-ui/core";
import React from "react";

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  height?: "default" | "const";
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
  onClose?: () => void;
}

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  height,
  title,
  subtitle,
  toolbar,
  onClick,
  ...rest
}) => (
  <CardHeader
    action={toolbar}
    className={className}
    title={title}
    subheader={subtitle}
    {...rest}
  >
    {children}
  </CardHeader>
);

CardTitle.displayName = "CardTitle";
export default CardTitle;
