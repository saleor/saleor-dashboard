import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Accordion, Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import styles from "./DetailGroupBox.module.css";

interface DetailGroupBoxProps {
  groupId: string;
  headerStart: ReactNode;
  headerEnd?: ReactNode;
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
   */
  variant?: "primary" | "secondary" | "card";
}

export const DetailGroupBox = ({
  groupId,
  headerStart,
  headerEnd,
  children,
  defaultExpanded = false,
  dataTestId,
  dataTestIsPrivate,
  marginTop,
  triggerButtonTestId,
  variant = "primary",
}: DetailGroupBoxProps): JSX.Element => {
  const [expanded, setExpanded] = useState<string | undefined>(
    defaultExpanded ? groupId : undefined,
  );
  const isExpanded = expanded === groupId;
  const isSecondary = variant === "secondary";
  const isCard = variant === "card";
  const resolvedMarginTop = marginTop ?? (isCard ? 0 : 4);

  return (
    <Box
      marginTop={resolvedMarginTop}
      data-test-id={dataTestId}
      data-test-is-private={dataTestIsPrivate}
    >
      <Accordion value={expanded} onValueChange={setExpanded}>
        <Accordion.Item value={groupId}>
          <Box
            backgroundColor={isSecondary || isCard ? "default1" : "default2"}
            borderRadius={isSecondary || isCard ? undefined : 4}
            borderStyle="solid"
            borderColor="default1"
            borderWidth={1}
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
              )}
              backgroundColor={isSecondary ? "default1" : "default2"}
            >
              {/* Trigger is only the title side so headerEnd actions don't toggle. */}
              <Accordion.Trigger className={styles.trigger}>
                <Box display="flex" alignItems="center" gap={2} minWidth={0} width="100%">
                  <Box
                    className={clsx(styles.chevron, isExpanded && styles.chevronOpen)}
                    data-test-id={triggerButtonTestId}
                  >
                    <ChevronDown size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                  </Box>
                  <Box minWidth={0} flexGrow="1">
                    {headerStart}
                  </Box>
                </Box>
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
                )}
                borderTopStyle="solid"
                borderColor="default1"
                borderTopWidth={isSecondary ? 0 : 1}
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
