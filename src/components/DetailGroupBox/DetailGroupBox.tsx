import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Accordion, Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import styles from "./DetailGroupBox.module.css";

/** Flush rows sit next to body-size labels, so the chevron steps down from the 16px default. */
const FLUSH_CHEVRON_SIZE = 14;
const FLUSH_CHEVRON_STROKE = 1.75;

interface DetailGroupBoxProps {
  groupId: string;
  headerStart: ReactNode;
  headerEnd?: ReactNode;
  /**
   * Second column of a flush row, aligned with the value column of a
   * `1fr 2fr` form row. Stays inside the expand control.
   */
  headerBody?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  dataTestId?: string;
  dataTestIsPrivate?: boolean;
  marginTop?: 0 | 1 | 2 | 3 | 4;
  /** Optional test id for the expand/collapse control (e.g. metadata modal tests). */
  triggerButtonTestId?: string;
  /**
   * `primary` — nested list row (tinted header).
   * `secondary` — sidebar ops card (white header).
   * `card` — top-level section card (DetailSettingsCard chrome: tinted header,
   * card paddings, size-5 title from consumer). Use when the foldable *is* the card.
   * `flush` — full-bleed row inside a `contentFlush` card: no surface of its own,
   * the parent list draws the dividers.
   */
  variant?: "primary" | "secondary" | "card" | "flush";
}

export const DetailGroupBox = ({
  groupId,
  headerStart,
  headerEnd,
  headerBody,
  children,
  defaultExpanded = false,
  dataTestId,
  dataTestIsPrivate,
  marginTop,
  triggerButtonTestId,
  variant = "primary",
}: DetailGroupBoxProps): React.ReactNode => {
  const [expanded, setExpanded] = useState<string | undefined>(
    defaultExpanded ? groupId : undefined,
  );
  const isExpanded = expanded === groupId;
  const isSecondary = variant === "secondary";
  const isCard = variant === "card";
  const isFlush = variant === "flush";
  const resolvedMarginTop = marginTop ?? (isCard || isFlush ? 0 : 4);

  return (
    <Box
      marginTop={resolvedMarginTop}
      data-test-id={dataTestId}
      data-test-is-private={dataTestIsPrivate}
      data-expanded={isExpanded ? "true" : "false"}
    >
      <Accordion value={expanded} onValueChange={setExpanded}>
        <Accordion.Item value={groupId}>
          <Box
            backgroundColor={isSecondary || isCard || isFlush ? "default1" : "default2"}
            borderRadius={isSecondary || isCard || isFlush ? undefined : 4}
            borderStyle="solid"
            borderColor="default1"
            borderWidth={isFlush ? 0 : 1}
            overflow="hidden"
            className={clsx(isSecondary && styles.surfaceSecondary, isCard && styles.surfaceCard)}
          >
            <Box
              className={clsx(
                styles.header,
                isCard && styles.headerCard,
                isCard && headerEnd && styles.headerCardWithEnd,
                isSecondary && styles.headerSecondary,
                isSecondary && isExpanded && styles.headerSecondaryExpanded,
                isFlush && styles.headerFlush,
                isFlush && isExpanded && styles.headerFlushExpanded,
                headerBody && styles.headerForm,
              )}
              backgroundColor={isSecondary || (isFlush && !isExpanded) ? "default1" : "default2"}
              {...(isFlush ? { "data-group-header": true } : {})}
            >
              {/* Trigger is only the title side so headerEnd actions don't toggle. */}
              <Accordion.Trigger className={headerBody ? styles.triggerForm : styles.trigger}>
                {headerBody ? (
                  <>
                    <Box className={styles.splitLead}>
                      <Box
                        className={clsx(
                          styles.chevron,
                          styles.chevronFlush,
                          isExpanded && styles.chevronOpen,
                        )}
                        data-test-id={triggerButtonTestId}
                      >
                        <ChevronDown size={FLUSH_CHEVRON_SIZE} strokeWidth={FLUSH_CHEVRON_STROKE} />
                      </Box>
                      <Box minWidth={0}>{headerStart}</Box>
                    </Box>
                    <Box className={styles.splitValue}>{headerBody}</Box>
                  </>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={isFlush ? 1.5 : 2}
                    minWidth={0}
                    width="100%"
                  >
                    <Box
                      className={clsx(
                        styles.chevron,
                        isFlush && styles.chevronFlush,
                        isExpanded && styles.chevronOpen,
                      )}
                      data-test-id={triggerButtonTestId}
                    >
                      <ChevronDown
                        size={isFlush ? FLUSH_CHEVRON_SIZE : iconSize.small}
                        strokeWidth={isFlush ? FLUSH_CHEVRON_STROKE : iconStrokeWidthBySize.small}
                      />
                    </Box>
                    <Box minWidth={0} flexGrow="1">
                      {headerStart}
                    </Box>
                  </Box>
                )}
              </Accordion.Trigger>
              {headerEnd ? (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={4}
                  flexShrink="0"
                  className={styles.headerEnd}
                >
                  {headerEnd}
                </Box>
              ) : null}
            </Box>

            <Accordion.Content>
              <Box
                className={clsx(
                  styles.content,
                  isSecondary && styles.contentSecondary,
                  isCard && styles.contentCard,
                  isFlush && styles.contentFlush,
                )}
                borderTopStyle="solid"
                borderColor="default1"
                borderTopWidth={isSecondary || isFlush ? 0 : 1}
                backgroundColor="default1"
              >
                {children}
              </Box>
            </Accordion.Content>
          </Box>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

DetailGroupBox.displayName = "DetailGroupBox";
