import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Accordion, Box } from "@saleor/macaw-ui-next";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

import styles from "./TranslationGroupBox.module.css";

interface TranslationGroupBoxProps {
  groupId: string;
  headerStart: React.ReactNode;
  headerEnd?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  dataTestId?: string;
}

export const TranslationGroupBox = ({
  groupId,
  headerStart,
  headerEnd,
  children,
  defaultExpanded = true,
  dataTestId,
}: TranslationGroupBoxProps) => {
  const [expanded, setExpanded] = useState<string | undefined>(
    defaultExpanded ? groupId : undefined,
  );

  return (
    <Box marginTop={4} data-test-id={dataTestId}>
      <Accordion value={expanded} onValueChange={setExpanded}>
        <Accordion.Item value={groupId}>
          <Box
            backgroundColor="default2"
            borderRadius={4}
            borderStyle="solid"
            borderColor="default1"
            borderWidth={1}
          >
            <Accordion.Trigger>
              <Box paddingY={4} paddingX={5} width="100%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={4}
                  width="100%"
                >
                  <Box display="flex" alignItems="center" gap={2} minWidth={0}>
                    <Box className={styles.chevron}>
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
                className={styles.content}
                borderTopStyle="solid"
                borderColor="default1"
                borderTopWidth={1}
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

TranslationGroupBox.displayName = "TranslationGroupBox";
