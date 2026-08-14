import { commonMessages } from "@dashboard/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { coerceHeaderEndActions } from "./coerceHeaderEndActions";
import styles from "./DetailSettingsCard.module.css";

interface DetailSettingsCardProps {
  title: ReactNode;
  /** Short line under the title in the header band (status, counts). Prefer `intro` for longer leading copy. */
  subtitle?: ReactNode;
  /** Leading description below the header — bordered intro row (payment gateways pattern). */
  intro?: ReactNode;
  headerEnd?: ReactNode;
  children: ReactNode;
  /** Drop content padding so list rows can use full-bleed dividers. */
  contentFlush?: boolean;
  "data-test-id"?: string;
}

export const DetailSettingsOptionalLabel = (): JSX.Element => (
  <Text as="span" size={2} color="default2" fontWeight="regular">
    <FormattedMessage {...commonMessages.optionalField} />
  </Text>
);

/**
 * Title content when you need an optional mark (or other inline chrome).
 * Typography (`size={5}` / bold / `h2`) is owned by `DetailSettingsCard` — do not wrap
 * this in another heading Text.
 */
export const DetailSettingsCardTitle = ({
  children,
  optional = false,
}: {
  children: ReactNode;
  optional?: boolean;
}): JSX.Element => (
  <Box display="inline-flex" alignItems="baseline" gap={2} flexWrap="wrap" as="span">
    <Box as="span">{children}</Box>
    {optional ? <DetailSettingsOptionalLabel /> : null}
  </Box>
);

export const DetailSettingsCardIntro = ({ children }: { children: ReactNode }): JSX.Element => (
  <Box className={styles.intro}>{children}</Box>
);

export const DetailSettingsCard = ({
  title,
  subtitle,
  intro,
  headerEnd,
  children,
  contentFlush = false,
  "data-test-id": dataTestId,
}: DetailSettingsCardProps): JSX.Element => (
  <Box className={styles.card} data-test-id={dataTestId}>
    <Box className={clsx(styles.header, headerEnd && styles.headerWithEnd)}>
      <Box className={styles.headerMain}>
        <Text size={5} fontWeight="bold" as="h2" className={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text size={3} color="default2">
            {subtitle}
          </Text>
        ) : null}
      </Box>
      {headerEnd ? (
        <Box className={styles.headerEnd} data-test-id="detail-settings-card-header-end">
          {coerceHeaderEndActions(headerEnd)}
        </Box>
      ) : null}
    </Box>
    {intro ? <DetailSettingsCardIntro>{intro}</DetailSettingsCardIntro> : null}
    <Box className={contentFlush ? styles.contentFlush : styles.content}>{children}</Box>
  </Box>
);

DetailSettingsCard.displayName = "DetailSettingsCard";
