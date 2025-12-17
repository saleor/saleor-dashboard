import { useIntl } from "react-intl";

interface FormatDateProps {
  date: string;
}

export const FormatDate = ({ date }: FormatDateProps) => {
  const intl = useIntl();

  return (
    <>
      {intl.formatDate(date, {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  );
};
