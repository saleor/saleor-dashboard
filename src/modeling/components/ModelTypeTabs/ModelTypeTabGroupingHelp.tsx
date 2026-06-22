import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { modelTypeTabsMessages } from "./messages";
import styles from "./ModelTypeTabGroupingHelp.module.css";

interface ModelTypeTabGroupingHelpProps {
  settingsOpen: boolean;
}

const renderEmphasis = (...chunks: ReactNode[]) => <Box as="em">{chunks}</Box>;

const renderStrong = (...chunks: ReactNode[]) => (
  <Box as="span" fontWeight="bold">
    {chunks}
  </Box>
);

const richTextFormatters = {
  em: renderEmphasis,
  strong: renderStrong,
};

export const ModelTypeTabGroupingHelp = ({ settingsOpen }: ModelTypeTabGroupingHelpProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!settingsOpen) {
      setOpen(false);
    }
  }, [settingsOpen]);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger>
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          cursor="pointer"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          aria-label={intl.formatMessage(modelTypeTabsMessages.groupingHelpAriaLabel)}
          data-test-id="model-type-tabs-grouping-help"
          onClick={event => event.stopPropagation()}
        >
          <CircleHelp size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="end">
        <Tooltip.Arrow />
        <Box className={styles.content} padding={3}>
          <Text size={2} fontWeight="bold">
            {intl.formatMessage(modelTypeTabsMessages.groupingHelpAriaLabel)}
          </Text>

          <Text size={2}>{intl.formatMessage(modelTypeTabsMessages.groupingHelpIntro)}</Text>

          <Box display="flex" flexDirection="column" gap={1}>
            <Text className={styles.sectionHeading}>
              {intl.formatMessage(modelTypeTabsMessages.groupingHelpExamplesHeading)}
            </Text>
            <Text size={2}>
              {intl.formatMessage(
                modelTypeTabsMessages.groupingHelpExampleStorefront,
                richTextFormatters,
              )}
            </Text>
            <Text size={2}>
              {intl.formatMessage(
                modelTypeTabsMessages.groupingHelpExampleHelp,
                richTextFormatters,
              )}
            </Text>
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Text className={styles.sectionHeading}>
              {intl.formatMessage(modelTypeTabsMessages.groupingHelpNotesHeading)}
            </Text>
            <ul className={styles.notesList}>
              <li>{intl.formatMessage(modelTypeTabsMessages.groupingHelpNoteSeparators)}</li>
              <li>{intl.formatMessage(modelTypeTabsMessages.groupingHelpNoteCase)}</li>
              <li>{intl.formatMessage(modelTypeTabsMessages.groupingHelpNoteStandalone)}</li>
            </ul>
          </Box>

          <Text size={1} color="default2" className={styles.scope}>
            {intl.formatMessage(modelTypeTabsMessages.groupingHelpScope)}
          </Text>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
