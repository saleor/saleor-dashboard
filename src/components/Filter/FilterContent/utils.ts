import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { makeStyles } from "@saleor/macaw-ui";
import { joinDateTime, splitDateTime } from "@saleor/misc";
import { IntlShape } from "react-intl";

import { FilterType } from "../types";

export const filterTestingContext = "filter-field-";

export const useCommonStyles = makeStyles(
  theme => ({
    andLabel: {
      margin: theme.spacing(1, 2, 1, 0),
    },
    arrow: {
      marginRight: theme.spacing(2),
    },
    input: {
      padding: "12px 0 9px 12px",
    },
    inputRange: {
      alignItems: "center",
      display: "flex",
    },
    inputTime: {
      marginLeft: theme.spacing(1),
      width: "150px",
    },
    spacer: {
      paddingRight: theme.spacing(4),
    },
  }),
  { name: "FilterContentBodyCommon" },
);

export function getIsFilterMultipleChoices(
  intl: IntlShape,
): SingleAutocompleteChoiceType[] {
  return [
    {
      label: intl.formatMessage({
        id: "I+UwqI",
        defaultMessage: "equal to",
        description: "is filter range or value",
      }),
      value: FilterType.SINGULAR,
    },
    {
      label: intl.formatMessage({
        id: "QBxN6z",
        defaultMessage: "between",
        description: "is filter range or value",
      }),
      value: FilterType.MULTIPLE,
    },
  ];
}

export const getDateFilterValue = (
  dateTime: string,
  dateTimeString: string | null,
  dateTimeFormat: boolean,
) => {
  const { date } = splitDateTime(dateTime);
  if (!dateTimeFormat) {
    return date;
  }
  const { time } = splitDateTime(dateTimeString);
  return joinDateTime(date, time);
};

export const getDateTimeFilterValue = (
  dateTimeString: string | null,
  timeString: string,
) => {
  const { date } = splitDateTime(dateTimeString || new Date().toISOString());
  return joinDateTime(date, timeString);
};
