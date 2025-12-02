import { LocaleConsumer } from "@dashboard/components/Locale";
import { TimezoneConsumer } from "@dashboard/components/Timezone";
import moment from "moment-timezone";
import { useIntl } from "react-intl";

interface OrderHistoryDateProps {
  date: string;
}

export const OrderHistoryDate = ({ date }: OrderHistoryDateProps) => {
  const intl = useIntl();

  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) => {
            const m = moment(date).locale(locale);

            if (tz) {
              m.tz(tz);
            }

            const now = moment().locale(locale);

            if (tz) {
              now.tz(tz);
            }

            // Relative time display (e.g., "1h ago", "2d ago")
            const diffMinutes = now.diff(m, "minutes");
            const diffHours = now.diff(m, "hours");
            const diffDays = now.diff(m, "days");

            let dateStr: string;

            if (diffMinutes < 1) {
              dateStr = intl.formatMessage({
                id: "wOaLvi",
                defaultMessage: "just now",
                description: "relative time",
              });
            } else if (diffMinutes < 60) {
              dateStr = intl.formatMessage(
                {
                  id: "cIoOf0",
                  defaultMessage: "{minutes}m ago",
                  description: "relative time in minutes",
                },
                { minutes: diffMinutes },
              );
            } else if (diffHours < 24) {
              dateStr = intl.formatMessage(
                {
                  id: "puYVLm",
                  defaultMessage: "{hours}h ago",
                  description: "relative time in hours",
                },
                { hours: diffHours },
              );
            } else if (diffDays < 7) {
              dateStr = intl.formatMessage(
                {
                  id: "pSFOFy",
                  defaultMessage: "{days}d ago",
                  description: "relative time in days",
                },
                { days: diffDays },
              );
            } else {
              dateStr = m.format("MMM D, YYYY");
            }

            // Full date with GMT for tooltip
            const offset = m.format("Z");
            const shortOffset = offset.endsWith(":00") ? offset.slice(0, -3) : offset;
            const fullDate = `${m.format("MMM D, YYYY, h:mm A")} GMT${shortOffset}`;

            return (
              <span title={fullDate} style={{ cursor: "default" }}>
                {dateStr}
              </span>
            );
          }}
        </LocaleConsumer>
      )}
    </TimezoneConsumer>
  );
};
