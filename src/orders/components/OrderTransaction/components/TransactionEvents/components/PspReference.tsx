import { useClipboard } from "@dashboard/hooks/useClipboard";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, sprinkles, Text, Tooltip, vars } from "@saleor/macaw-ui-next";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { PspReferenceLink } from "./PspReferenceLink";

const useStyles = makeStyles(
  () => ({
    externalIcon: {
      flexShrink: 0,
      color: vars.colors.text.default2,
      transition: "color 0.15s ease-in-out",
    },
    pillHovered: {
      "& $externalIcon": {
        color: vars.colors.text.default1,
      },
    },
  }),
  { name: "PspReference" },
);

interface PspReferenceProps {
  reference: string;
  url?: string;
}

export const PspReference = ({ reference, url }: PspReferenceProps) => {
  const intl = useIntl();
  const classes = useStyles();
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
      className={isPillHovered ? classes.pillHovered : undefined}
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
      <Box __width="12px" __height="12px" flexShrink="0">
        {url && <ExternalLinkIcon size={12} className={classes.externalIcon} />}
      </Box>
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
          aria-label={intl.formatMessage({
            defaultMessage: "Copy to clipboard",
            id: "aCdAsI",
          })}
        />
      </Box>
    </Box>
  );
};
