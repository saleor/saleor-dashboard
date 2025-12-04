import { useClipboard } from "@dashboard/hooks/useClipboard";
import { Box, Button, sprinkles, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";

import { PspReferenceLink } from "./PspReferenceLink";

interface PspReferenceProps {
  reference: string;
  url?: string;
}

export const PspReference = ({ reference, url }: PspReferenceProps) => {
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
    >
      <Tooltip>
        <Tooltip.Trigger>
          <Box
            backgroundColor="default1"
            borderRadius={2}
            borderStyle="solid"
            borderWidth={1}
            borderColor="default1"
            paddingX={1.5}
            paddingY={0.5}
            __maxWidth="150px"
          >
            <Text
              size={2}
              fontWeight="medium"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              display="block"
            >
              <PspReferenceLink href={url}>{reference}</PspReferenceLink>
            </Text>
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          <Text size={2}>{reference}</Text>
        </Tooltip.Content>
      </Tooltip>
      <Box
        style={{
          opacity: showCopyButton ? 1 : 0,
          transition: "opacity 0.15s ease-in-out",
        }}
        pointerEvents={showCopyButton ? "auto" : "none"}
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
          onClick={() => copy(reference)}
          aria-label={intl.formatMessage({
            defaultMessage: "Copy to clipboard",
            id: "aCdAsI",
          })}
        />
      </Box>
    </Box>
  );
};
