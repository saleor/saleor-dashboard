import { Sprinkles, sprinkles } from "@saleor/macaw-ui-next";
import { Check, Copy } from "lucide-react";

interface ClipboardCopyIconProps extends Sprinkles {
  hasBeenClicked: boolean;
}

export const ClipboardCopyIcon = ({ hasBeenClicked, ...sprinkleProps }: ClipboardCopyIconProps) => {
  const className = sprinkles({ color: "default2", ...sprinkleProps });

  return hasBeenClicked ? (
    <Check size={16} className={className} />
  ) : (
    <Copy size={16} className={className} />
  );
};
