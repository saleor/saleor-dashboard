import { defineMessages } from "react-intl";

export const discountCountrySelectDialogMessages = defineMessages({
  title: {
    id: "cvVIV/",
    defaultMessage: "Assign Countries",
    description: "dialog header",
  },
  description: {
    id: "dWK/Ck",
    defaultMessage: "Choose countries, you want voucher to be limited to, from the list below",
  },
  searchLabel: {
    id: "8EGagh",
    defaultMessage: "Filter Countries",
    description: "search box label",
  },
  searchPlaceholder: {
    id: "dGqEJ9",
    defaultMessage: "Search by country name",
    description: "search box placeholder",
  },
  assignCountedButton: {
    id: "9WBeX6",
    defaultMessage: "Assign ({count, plural, one {# country} other {# countries}})",
    description: "assign button with selected country count",
  },
  notFoundTitle: {
    id: "q0TV+c",
    defaultMessage: "No countries found",
    description: "no countries found in assign countries dialog",
  },
});
