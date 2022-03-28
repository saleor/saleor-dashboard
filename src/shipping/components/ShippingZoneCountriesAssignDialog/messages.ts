import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignCountriesTitle: {
    defaultMessage: "Assign Countries",
    description: "dialog header"
  },
  assignCountriesDescription: {
    defaultMessage:
      "Choose countries you want to add to shipping zone from list below",
    description: "dialog description"
  },
  searchCountriesLabel: {
    defaultMessage: "Search Countries",
    description: "search label"
  },
  searchCountriesPlaceholder: {
    defaultMessage: "Search by country name",
    description: "search placeholder"
  },
  quickPickSubtitle: {
    defaultMessage: "Quick Pick",
    description: "section title"
  },
  countriesSubtitle: {
    defaultMessage: "Countries A to Z",
    description: "country selection"
  },
  restOfTheWorldCheckbox: {
    defaultMessage: "Rest of the World",
    description: "checkbox label"
  },
  restOfTheWorldCheckboxDescription: {
    defaultMessage:
      "If selected, this will add all of the countries not selected to other shipping zones",
    description: "checkbox description"
  },
  assignCountriesButton: {
    defaultMessage: "Assign and save",
    description: "assign countries to shipping zone and save, button"
  }
});
