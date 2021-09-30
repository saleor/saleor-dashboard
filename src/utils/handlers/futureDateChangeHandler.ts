import { FormChange } from "@saleor/hooks/useForm";
import moment from "moment";

function createFutureDateChangeHandler(
  dateTimeFormsetName: string,
  change: FormChange
) {
  return (event: React.ChangeEvent<any>, dateTimeString: string) => {
    let dateTime = moment(dateTimeString);

    switch (event.target.name) {
      case "date":
        const date = moment(event.target.value, "YYYY-MM-DD");
        dateTime
          .year(date.year())
          .month(date.month())
          .date(date.date());
        break;

      case "hour":
        const time = moment(event.target.value, "HH:mm");
        dateTime.hour(time.hour()).minute(time.minutes());
        break;
    }

    if (dateTime.isBefore(Date.now()) || !dateTime.isValid()) {
      dateTime = moment(Date.now());
    }

    change({
      target: {
        name: dateTimeFormsetName,
        value: dateTime.toISOString()
      }
    });
  };
}

export default createFutureDateChangeHandler;
