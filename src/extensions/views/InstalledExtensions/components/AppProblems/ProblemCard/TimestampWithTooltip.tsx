import { problemMessages } from "@dashboard/extensions/messages";
import useLocale from "@dashboard/hooks/useLocale";
import { Tooltip } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import styles from "../AppProblems.module.css";

const useFormattedDates = (date: string) => {
  const { locale } = useLocale();

  return useMemo(() => {
    const d = new Date(date);

    const short = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);

    const local = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);

    const utc = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    }).format(d);

    return { short, local, utc };
  }, [date, locale]);
};

interface TimestampWithTooltipProps {
  date: string;
  label?: string;
}

export const TimestampWithTooltip = ({ date, label }: TimestampWithTooltipProps) => {
  const intl = useIntl();
  const { short, local, utc } = useFormattedDates(date);

  return (
    <>
      {label}{" "}
      <Tooltip>
        <Tooltip.Trigger>
          <time dateTime={date} className={styles.timestampHoverable}>
            {short}
          </time>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          <div className={styles.timestampTooltip}>
            <div>{intl.formatMessage(problemMessages.localTime, { time: local })}</div>
            <div>{intl.formatMessage(problemMessages.utcTime, { time: utc })}</div>
          </div>
        </Tooltip.Content>
      </Tooltip>
    </>
  );
};
