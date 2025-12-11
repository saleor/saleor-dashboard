import { useClipboard } from "@dashboard/hooks/useClipboard";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, sprinkles, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import styles from "./PspReference.module.css";
import { PspReferenceLink } from "./PspReferenceLink";

interface PspReferenceProps {
  reference: string;
  url?: string;
}

export const PspReference = ({ reference, url }: PspReferenceProps) => {
  const intl = useIntl();
  const [copied, copy] = useClipboard();
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isPillHovered, setIsPillHovered] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const iconClassName = sprinkles({ color: "default2" });

  useEffect(() => {
    const el = textRef.current;

    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [reference]);

  const content = (
    <Box
      backgroundColor="default2"
      borderRadius={2}
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
      paddingX={1.5}
      paddingY={0.5}
      __width="150px"
      display="flex"
      alignItems="center"
      gap={1}
      className={clsx(isPillHovered && styles.pillHovered)}
      onMouseEnter={() => setIsPillHovered(true)}
      onMouseLeave={() => setIsPillHovered(false)}
    >
      <Text
        ref={textRef}
        size={2}
        fontWeight="medium"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <PspReferenceLink href={url}>{reference}</PspReferenceLink>
      </Text>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
          <ExternalLinkIcon size={12} className={styles.externalIcon} />
        </a>
      )}
    </Box>
  );

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      {isTruncated ? (
        <Tooltip>
          <Tooltip.Trigger>{content}</Tooltip.Trigger>
          <Tooltip.Content side="top">
            <Tooltip.Arrow />
            <Text size={2}>{reference}</Text>
          </Tooltip.Content>
        </Tooltip>
      ) : (
        content
      )}
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
          title={intl.formatMessage(buttonMessages.copyToClipboard)}
          aria-label={intl.formatMessage(buttonMessages.copyToClipboard)}
        />
      </Box>
    </Box>
  );
};
