import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import {
  NewRadioGroupField as RadioGroupField,
  type RadioGroupFieldChoice,
} from "@dashboard/components/RadioGroupField";
import { type ExportErrorFragment, ExportScope, FileTypesEnum } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getExportErrorMessage from "@dashboard/utils/errors/export";
import { Box, Text } from "@saleor/macaw-ui-next";
import {
  defineMessages,
  FormattedMessage,
  type IntlShape,
  type MessageDescriptor,
  useIntl,
} from "react-intl";

import { type ExportSettingsInput } from "./types";

export type ExportItemsQuantity = Record<"all" | "filter", number>;

export interface ExportScopeLabels {
  allItems: string;
  filteredItems: string;
  selectedItems: string;
}

export const exportDialogScopeMessages = defineMessages({
  filteredItems: {
    id: "F2fOM7",
    defaultMessage: "List view filters ({number})",
    description: "export scope option for items matching list view filters and search",
  },
  productsToInclude: {
    id: "bbSkxt",
    defaultMessage: "Products to include",
    description: "export scope section header for products",
  },
  giftCardsToInclude: {
    id: "7bueG3",
    defaultMessage: "Gift cards to include",
    description: "export scope section header for gift cards",
  },
  fileFormat: {
    id: "wqaEMQ",
    defaultMessage: "File format",
    description: "export file type section header",
  },
  listFiltersDisabledHint: {
    id: "JB7OuS",
    defaultMessage: "Apply filters or search on the list to enable this option.",
    description: "export scope option disabled when list has no active filters",
  },
});

export const getFilteredItemsScopeLabel = (intl: IntlShape, count?: number): string =>
  intl.formatMessage(exportDialogScopeMessages.filteredItems, {
    number: count ?? "...",
  });

interface ExportDialogSettingsProps {
  data: ExportSettingsInput;
  errors: ExportErrorFragment[];
  selectedItems: number;
  exportScopeLabels: ExportScopeLabels;
  onChange: (event: ChangeEvent) => void;
  allowScopeSelection?: boolean;
  hasListFilters: boolean;
  scopeSectionMessage?: MessageDescriptor;
}

const formFields: Array<keyof ExportSettingsInput> = ["fileType", "scope"];

export const ExportDialogSettings = ({
  data,
  errors,
  onChange,
  selectedItems,
  exportScopeLabels,
  allowScopeSelection = true,
  hasListFilters,
  scopeSectionMessage = exportDialogScopeMessages.productsToInclude,
}: ExportDialogSettingsProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(formFields, errors);
  const productExportTypeChoices: Array<RadioGroupFieldChoice<FileTypesEnum>> = [
    {
      label: intl.formatMessage({
        id: "9Tl/bT",
        defaultMessage: "Spreadsheet for Excel, Numbers etc.",
        description: "export items as spreadsheet",
      }),
      value: FileTypesEnum.XLSX,
    },
    {
      label: intl.formatMessage({
        id: "li1BBk",
        defaultMessage: "Plain CSV file",
        description: "export items as csv file",
      }),
      value: FileTypesEnum.CSV,
    },
  ];
  const exportScopeChoices = [
    {
      label: exportScopeLabels.allItems,
      value: ExportScope.ALL,
    },
    {
      disabled: selectedItems === 0,
      label: exportScopeLabels.selectedItems,
      value: ExportScope.IDS,
    },
    {
      disabled: !hasListFilters,
      label: exportScopeLabels.filteredItems,
      value: ExportScope.FILTER,
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {allowScopeSelection && (
        <Box display="flex" flexDirection="column" gap={3}>
          <ModalSectionHeader>
            <FormattedMessage {...scopeSectionMessage} />
          </ModalSectionHeader>

          <RadioGroupField
            name="scope"
            value={data.scope}
            error={!!formErrors.scope}
            onChange={onChange}
            choices={exportScopeChoices}
            errorMessage={getExportErrorMessage(formErrors.scope, intl)}
          />

          {!hasListFilters && (
            <Text size={2} color="default2">
              <FormattedMessage {...exportDialogScopeMessages.listFiltersDisabledHint} />
            </Text>
          )}
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        <ModalSectionHeader>
          <FormattedMessage {...exportDialogScopeMessages.fileFormat} />
        </ModalSectionHeader>

        <RadioGroupField
          name="fileType"
          value={data.fileType}
          error={!!formErrors.fileType}
          onChange={onChange}
          choices={productExportTypeChoices}
          errorMessage={getExportErrorMessage(formErrors.fileType, intl)}
        />
      </Box>
    </Box>
  );
};
