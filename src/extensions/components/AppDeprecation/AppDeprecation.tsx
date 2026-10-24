import { deprecationMessages } from "@dashboard/extensions/messages";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { TriangleAlert } from "lucide-react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AppDeprecation.module.css";

/** Deprecation reason clamped to `lines`; "Show more" appears only when the reason overflows. */
export const AppDeprecationReason = ({
  reason,
  lines,
  className,
}: {
  reason: string;
  lines: number;
  className?: string;
}) => {
  const intl = useIntl();
  const reasonRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const element = reasonRef.current;

    if (expanded || !element) {
      return;
    }

    const measure = () => setOverflows(element.scrollHeight > element.clientHeight);

    measure();
    // Web fonts re-wrap the text without resizing the clamped box, so the observer misses it.
    document.fonts?.ready.then(measure);

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => observer.disconnect();
  }, [reason, expanded]);

  return (
    <Box className={clsx(styles.reasonRow, className)} data-test-id="app-deprecation-reason">
      <Text
        ref={reasonRef}
        size={3}
        className={clsx(styles.reason, !expanded && styles.clamped)}
        style={expanded ? undefined : { WebkitLineClamp: lines }}
      >
        {reason}
      </Text>
      {(overflows || expanded) && (
        <Button
          variant="tertiary"
          size="small"
          className={styles.toggle}
          onClick={() => setExpanded(value => !value)}
        >
          {intl.formatMessage(expanded ? deprecationMessages.showLess : buttonMessages.moreOptions)}
        </Button>
      )}
    </Box>
  );
};

interface AppDeprecationNoticeProps {
  reason: string;
  /** Rendered under the reason, e.g. an acknowledgement checkbox. */
  children?: ReactNode;
  className?: string;
}

export const AppDeprecationNotice = ({
  reason,
  children,
  className,
}: AppDeprecationNoticeProps) => {
  return (
    <Box className={clsx(styles.notice, className)} data-test-id="app-deprecation-notice">
      <TriangleAlert size={20} className={styles.icon} />
      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={3} fontWeight="medium">
          <FormattedMessage {...deprecationMessages.title} />
        </Text>
        <Text size={3} color="default2">
          <FormattedMessage {...deprecationMessages.description} />
        </Text>
        <Text size={3} className={styles.reason}>
          {reason}
        </Text>
        {children}
      </Box>
    </Box>
  );
};
