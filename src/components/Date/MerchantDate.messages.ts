import { defineMessages } from "react-intl";

// Per-kind, per-bucket messages so translators can render the full phrase
// natively rather than concatenating a label with a separate time fragment
// (which breaks in many languages).
export const merchantDateMessages = defineMessages({
  placedJustNow: {
    id: "6fIHWa",
    defaultMessage: "Placed just now",
    description: "order header date, less than a minute ago",
  },
  placedMinutesAgo: {
    id: "G2WJ1J",
    defaultMessage: "Placed {minutes, plural, one {# minute} other {# minutes}} ago",
    description: "order header date, less than an hour ago",
  },
  placedToday: {
    id: "a4iag6",
    defaultMessage: "Placed today at {time}",
    description: "order header date, earlier today",
  },
  placedYesterday: {
    id: "ULBvyx",
    defaultMessage: "Placed yesterday at {time}",
    description: "order header date, yesterday",
  },
  placedThisYear: {
    id: "zmKgYS",
    defaultMessage: "Placed {date} at {time}",
    description: "order header date, same year and older than yesterday",
  },
  placedOn: {
    id: "rGj6RR",
    defaultMessage: "Placed {date}",
    description: "order header date, older than yesterday",
  },
  createdJustNow: {
    id: "QQdTUC",
    defaultMessage: "Created just now",
    description: "order header date, less than a minute ago",
  },
  createdMinutesAgo: {
    id: "k8k07f",
    defaultMessage: "Created {minutes, plural, one {# minute} other {# minutes}} ago",
    description: "order header date, less than an hour ago",
  },
  createdToday: {
    id: "GGhg9z",
    defaultMessage: "Created today at {time}",
    description: "order header date, earlier today",
  },
  createdYesterday: {
    id: "vFaikw",
    defaultMessage: "Created yesterday at {time}",
    description: "order header date, yesterday",
  },
  createdThisYear: {
    id: "8jirr+",
    defaultMessage: "Created {date} at {time}",
    description: "order header date, same year and older than yesterday",
  },
  createdOn: {
    id: "oWIL0E",
    defaultMessage: "Created {date}",
    description: "order header date, older than yesterday",
  },
});
