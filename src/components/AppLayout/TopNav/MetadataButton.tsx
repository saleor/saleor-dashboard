import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Button, type ButtonProps } from "@saleor/macaw-ui-next";
import { Code } from "lucide-react";

type MetadataButtonProps = Omit<ButtonProps, "variant" | "icon" | "title"> & {
  title: string;
};

export const MetadataButton = ({ title, ...props }: MetadataButtonProps) => (
  <Button
    variant="secondary"
    icon={<Code size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
    title={title}
    {...props}
  />
);
