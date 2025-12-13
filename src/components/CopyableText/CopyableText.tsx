import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Box, Button, sprinkles, Text } from "@saleor/macaw-ui-next";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";

interface CopyableTextProps {
  text: string;
}

export const CopyableText = ({ text }: CopyableTextProps): JSX.Element => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const [showCopyButton, setShowCopyButton] = useState(false);
  const iconClassName = sprinkles({ color: "default2" });

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
      onFocus={() => setShowCopyButton(true)}
      onBlur={() => setShowCopyButton(false)}
    >
      <Text size={2}>{text}</Text>
      <Box
        style={{
          opacity: showCopyButton ? 1 : 0,
          transition: "opacity 0.15s ease-in-out",
        }}
      >
        <Button
          variant="tertiary"
          size="small"
          icon={
            copied ? (
              <CheckIcon size={14} className={iconClassName} />
            ) : (
              <CopyIcon size={14} className={iconClassName} />
            )
          }
          onClick={() => copy(text)}
          aria-label={intl.formatMessage({
            defaultMessage: "Copy to clipboard",
            id: "aCdAsI",
          })}
        />
      </Box>
    </Box>
  );
};
