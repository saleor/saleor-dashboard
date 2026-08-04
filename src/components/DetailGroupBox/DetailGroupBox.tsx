import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Accordion, Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

import styles from "./DetailGroupBox.module.css";

interface DetailGroupBoxProps {
  groupId: string;
  headerStart: React.ReactNode;
  headerEnd?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  dataTestId?: string;
  dataTestIsPrivate?: boolean;
  marginTop?: 0 | 1 | 2 | 3 | 4;
  /** Optional test id for the expand/collapse control (e.g. metadata modal tests). */
  triggerButtonTestId?: string;
  /** `primary` = tinted header; `secondary` = sidebar ops card (white header). */
  variant?: "primary" | "secondary";
}

export const DetailGroupBox = ({
  groupId,
  headerStart,
  headerEnd,
  children,
  defaultExpanded = false,
  dataTestId,
  dataTestIsPrivate,
  marginTop = 4,
  triggerButtonTestId,
  variant = "primary",
}: DetailGroupBoxProps) => {
  const [expanded, setExpanded] = useState<string | undefined>(
    defaultExpanded ? groupId : undefined,
  );
  const isExpanded = expanded === groupId;
  const isSecondary = variant === "secondary";

  return (
    <Box marginTop={marginTop} data-test-id={dataTestId} data-test-is-private={dataTestIsPrivate}>
      <Accordion value={expanded} onValueChange={setExpanded}>
        <Accordion.Item value={groupId}>
          <Box
            backgroundColor={isSecondary ? "default1" : "default2"}
            borderRadius={isSecondary ? undefined : 4}
            borderStyle="solid"
            borderColor="default1"
            borderWidth={1}
            overflow="hidden"
            className={isSecondary ? styles.surfaceSecondary : undefined}
          >
            <Accordion.Trigger>
              <Box
                paddingY={4}
                paddingX={isSecondary ? 4 : 5}
                width="100%"
                backgroundColor={isSecondary ? "default1" : "default2"}
                borderBottomStyle={isSecondary && isExpanded ? "solid" : undefined}
                borderColor="default1"
                borderBottomWidth={isSecondary && isExpanded ? 1 : undefined}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={4}
                  width="100%"
                >
                  <Box display="flex" alignItems="center" gap={2} minWidth={0}>
                    <Box
                      className={clsx(styles.chevron, isExpanded && styles.chevronOpen)}
                      data-test-id={triggerButtonTestId}
                    >
                      <ChevronDown
                        size={iconSize.small}
                        strokeWidth={iconStrokeWidthBySize.small}
                      />
                    </Box>
                    <Box minWidth={0}>{headerStart}</Box>
                  </Box>
                  {headerEnd && (
                    <Box display="flex" alignItems="center" gap={4} flexShrink="0">
                      {headerEnd}
                    </Box>
                  )}
                </Box>
              </Box>
            </Accordion.Trigger>

            <Accordion.Content>
              <Box
                className={clsx(styles.content, isSecondary && styles.contentSecondary)}
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
