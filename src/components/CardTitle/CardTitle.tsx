import { CardHeader } from "@material-ui/core";
import React from "react";

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
  onClose?: () => void;
}

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  title,
  subtitle,
  toolbar,
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
