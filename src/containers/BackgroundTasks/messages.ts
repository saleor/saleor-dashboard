import { defineMessages } from "react-intl";

export default defineMessages({
  exportFailedTitle: {
    defaultMessage: "Product Export Failed"
  },
  exportFinishedText: {
    defaultMessage:
      "Product export has finished and was sent to your email address."
  },
  exportFinishedTitle: {
    defaultMessage: "Exporting CSV finished",
    description: "csv file exporting has finished, header"
  },
  invoiceGenerateFinishedText: {
    defaultMessage:
      "Requested Invoice was generated. It was added to the top of the invoice list on this view. Enjoy!"
  },
  invoiceGenerateFinishedTitle: {
    defaultMessage: "Invoice Generated",
    description: "invoice generating has finished, header"
  },
  invoiceGenerationFailedTitle: {
    defaultMessage: "Invoice Generation",
    description: "dialog header, title"
  }
});
