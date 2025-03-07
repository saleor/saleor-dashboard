import { CardHeader } from "@material-ui/core";
import { MouseEvent, ReactNode } from "react";

interface CardTitleProps {
  children?: ReactNode;
  className?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  toolbar?: ReactNode;
  onClick?: (event: MouseEvent<any>) => void;
  onClose?: () => void;
}

const CardTitle = ({ className, children, title, subtitle, toolbar, ...rest }: CardTitleProps) => (
  <CardHeader action={toolbar} className={className} title={title} subheader={subtitle} {...rest}>
    {children}
  </CardHeader>
);

CardTitle.displayName = "CardTitle";
export default CardTitle;
