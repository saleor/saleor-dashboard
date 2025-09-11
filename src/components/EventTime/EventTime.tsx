import useLocale from "@dashboard/hooks/useLocale";

const EventTime = ({ date, showSeconds }: { date: string; showSeconds?: boolean }) => {
  const { locale } = useLocale();
  const intl = new Intl.DateTimeFormat(locale, {
    timeZoneName: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
  });

  return <time dateTime={date}>{intl.format(new Date(date))}</time>;
};

export default EventTime;
