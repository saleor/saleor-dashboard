import useLocale from "@dashboard/hooks/useLocale";
import { Text } from "@saleor/macaw-ui-next";

export const EventTime = ({ date }: { date: string }) => {
  const { locale } = useLocale();
  const intl = new Intl.DateTimeFormat(locale, {
    timeZoneName: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!date || new Date(date).toString() === "Invalid Date") {
    return (
      <Text size={2} color="default2">
        —
      </Text>
    );
  }

  return (
    <Text size={2} whiteSpace="nowrap">
      <time dateTime={date}>{intl.format(new Date(date))}</time>
    </Text>
  );
};
