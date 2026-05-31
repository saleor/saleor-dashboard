import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Ripple as RippleIndicator } from "@dashboard/ripples/components/Ripple";
import { type Ripple } from "@dashboard/ripples/types";
import { Box, Button, type ButtonProps } from "@saleor/macaw-ui-next";
import { Code } from "lucide-react";

type MetadataButtonProps = Omit<ButtonProps, "variant" | "icon" | "title"> & {
  title: string;
  ripple?: Ripple;
};

export const MetadataButton = ({ title, ripple, ...props }: MetadataButtonProps) => (
  <Box position="relative" display="inline-flex">
    <Button
      variant="secondary"
      icon={<Code size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
      title={title}
      {...props}
    />
    {ripple ? (
      <Box position="absolute" __top="-4px" __right="-4px">
        <RippleIndicator model={ripple} />
      </Box>
    ) : null}
  </Box>
);
