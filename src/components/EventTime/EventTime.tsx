import useLocale from "@dashboard/hooks/useLocale";

const EventTime = ({ date }: { date: string }) => {
  const { locale } = useLocale();
  const intl = new Intl.DateTimeFormat(locale, {
    timeZoneName: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return <time dateTime={date}>{intl.format(new Date(date))}</time>;
};

export default EventTime;
