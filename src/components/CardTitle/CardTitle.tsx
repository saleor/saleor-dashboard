import { CardHeader } from "@material-ui/core";
import React from "react";

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  height?: "default" | "const";
  title: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  height,
  title,
  toolbar,
  onClick,
  ...rest
}) => (
  <CardHeader action={toolbar} className={className} title={title} {...rest}>
    {children}
  </CardHeader>
);

CardTitle.displayName = "CardTitle";
export default CardTitle;
