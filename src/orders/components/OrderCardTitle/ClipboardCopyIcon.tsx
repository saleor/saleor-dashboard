import { sprinkles } from "@saleor/macaw-ui-next";
import { CheckIcon, CopyIcon } from "lucide-react";

interface ClipboardCopyIconProps {
  hasBeenClicked: boolean;
}

export const ClipboardCopyIcon = ({ hasBeenClicked }: ClipboardCopyIconProps): JSX.Element => {
  const className = sprinkles({ color: "default2" });

  return hasBeenClicked ? (
    <CheckIcon size={16} className={className} />
  ) : (
    <CopyIcon size={16} className={className} />
  );
};
