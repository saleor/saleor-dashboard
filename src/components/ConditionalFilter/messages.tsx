import { defineMessages, useIntl } from "react-intl";

export const conditionalFilterMessages = defineMessages({
  popoverTrigger: {
    defaultMessage: "Filters {count, plural, =0 {} other {({count})} }",
    id: "RZDxej",
    description: "Popover trigger text (button)",
  },
  popoverTitle: {
    defaultMessage: "Conditions",
    id: "LeJClL",
    description: "Popover title",
  },
  addFilter: {
    defaultMessage: "Add filter",
    id: "ECpTeb",
    description: "Add filter button text",
  },
  clearFilters: {
    defaultMessage: "Clear filters",
    id: "SHF+gG",
    description: "Clear filters button text",
  },
  saveFilters: {
    defaultMessage: "Save",
    id: "wUQCnQ",
    description: "Save filters button text",
  },
  applyFilters: {
    defaultMessage: "Filter",
    id: "pTOnzt",
    description: "Apply filters button text in modal picker",
  },
  emptyFilters: {
    defaultMessage: "Add filter to start",
    id: "B5KI59",
    description: "Empty filters text",
  },
  filterWhereElement: {
    defaultMessage: "Where",
    id: "5o84YO",
    description: "Filter where element text",
  },
  filterAndElement: {
    defaultMessage: "And",
    id: "5ZYUn5",
    description: "Filter and element text",
  },
  filterOrElement: {
    defaultMessage: "Or",
    id: "LdNCP/",
    description: "Filter or element text",
  },
});

export const useFiltersAreaTranslations = () => {
  const { formatMessage } = useIntl();

  return {
    addFilter: formatMessage(conditionalFilterMessages.addFilter),
    clearFilters: formatMessage(conditionalFilterMessages.clearFilters),
    saveFilters: formatMessage(conditionalFilterMessages.saveFilters),
    applyFilters: formatMessage(conditionalFilterMessages.applyFilters),
    locale: {
      WHERE: formatMessage(conditionalFilterMessages.filterWhereElement),
      AND: formatMessage(conditionalFilterMessages.filterAndElement),
      OR: formatMessage(conditionalFilterMessages.filterOrElement),
      noValueText: formatMessage(conditionalFilterMessages.emptyFilters),
    },
  };
};
