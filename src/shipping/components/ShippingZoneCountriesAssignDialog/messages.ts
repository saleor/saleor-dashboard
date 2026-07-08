import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignCountriesTitle: {
    id: "cvVIV/",
    defaultMessage: "Assign Countries",
    description: "dialog header",
  },
  assignCountriesDescription: {
    id: "AjInNW",
    defaultMessage: "Choose countries you want to add to shipping zone from list below",
    description: "dialog description",
  },
  searchCountriesLabel: {
    id: "pGDYG5",
    defaultMessage: "Search Countries",
    description: "search label",
  },
  searchCountriesPlaceholder: {
    id: "1rpzrM",
    defaultMessage: "Search by country name",
    description: "search placeholder",
  },
  quickPicksTitle: {
    id: "HUpSiH",
    defaultMessage: "Quick picks",
    description: "section title for country preset shortcuts in assign countries dialog",
  },
  quickPicksDescription: {
    id: "UIiVi2",
    defaultMessage:
      "Add common country groups in one click. Adjust individual countries in the list below.",
    description: "section hint for country preset shortcuts in assign countries dialog",
  },
  europeanUnionTitle: {
    id: "qsQQm4",
    defaultMessage: "European Union ({count})",
    description: "quick pick label for EU member states",
  },
  northAmericaTitle: {
    id: "07nmyw",
    defaultMessage: "North America",
    description: "quick pick label for United States, Canada, and Mexico",
  },
  restOfTheWorldTitle: {
    id: "SQ8elk",
    defaultMessage: "Rest of the World",
    description: "quick pick label for unassigned countries",
  },
  restOfTheWorldDescription: {
    id: "pBuMjY",
    defaultMessage: "Countries not assigned to any other shipping zone.",
    description: "tooltip for rest of the world quick pick in assign countries dialog",
  },
  restOfTheWorldTooltipAriaLabel: {
    id: "kGW52l",
    defaultMessage: "About Rest of the World",
    description: "aria label for rest of the world quick pick help tooltip",
  },
  assignCountriesButton: {
    id: "f+EgUw",
    defaultMessage: "Assign and save ({count, plural, one {# country} other {# countries}})",
    description: "assign countries to shipping zone and save, button with selected country count",
  },
  notFoundTitle: {
    id: "q0TV+c",
    defaultMessage: "No countries found",
    description: "no countries found in assign countries dialog",
  },
});
