import { type ProductPublishDraft } from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { sanitizeSpreadsheetPrice } from "@dashboard/components/PriceFieldV2/utils";
import {
  parseSpreadsheetClipboard,
  trimEmptyTrailingRows,
} from "@dashboard/utils/spreadsheetPaste/parseSpreadsheetClipboard";
import { sanitizeSpreadsheetInteger } from "@dashboard/utils/spreadsheetPaste/sanitizeSpreadsheetInteger";
import { type ClipboardEvent } from "react";

// Multi-field paste for bulk publish. Generic parse lives in utils/spreadsheetPaste.
// See docs/follow-ups/spreadsheet-paste-reuse.md

export type BulkPublishPasteField = "price" | "costPrice" | "stock";

export { parseSpreadsheetClipboard, sanitizeSpreadsheetInteger };

const FIELD_ORDER_WITH_STOCK: BulkPublishPasteField[] = ["price", "costPrice", "stock"];
const FIELD_ORDER_WITHOUT_STOCK: BulkPublishPasteField[] = ["price", "costPrice"];

const getFieldsFromPasteStart = (
  startField: BulkPublishPasteField,
  showStock: boolean,
): BulkPublishPasteField[] => {
  const order = showStock ? FIELD_ORDER_WITH_STOCK : FIELD_ORDER_WITHOUT_STOCK;
  const startIndex = order.indexOf(startField);

  return startIndex === -1 ? [] : order.slice(startIndex);
};

const sanitizeSpreadsheetFieldValue = (
  value: string,
  field: BulkPublishPasteField,
  currency: string,
): string | null => {
  if (field === "stock") {
    return sanitizeSpreadsheetInteger(value);
  }

  return sanitizeSpreadsheetPrice(value, currency);
};

export const applySpreadsheetPasteToDrafts = ({
  drafts,
  startProductIndex,
  startField,
  pastedText,
  showStock,
  currency,
}: {
  drafts: ProductPublishDraft[];
  startProductIndex: number;
  startField: BulkPublishPasteField;
  pastedText: string;
  showStock: boolean;
  currency: string;
}): { drafts: ProductPublishDraft[]; handled: boolean } => {
  const grid = trimEmptyTrailingRows(parseSpreadsheetClipboard(pastedText));
  const fields = getFieldsFromPasteStart(startField, showStock);

  if (grid.length === 0 || fields.length === 0 || startProductIndex < 0) {
    return { drafts, handled: false };
  }

  const updatedDrafts = drafts.map(draft => ({ ...draft }));
  let handled = false;

  grid.forEach((row, rowOffset) => {
    const draftIndex = startProductIndex + rowOffset;

    if (draftIndex >= updatedDrafts.length) {
      return;
    }

    row.forEach((cell, columnOffset) => {
      const field = fields[columnOffset];

      if (!field) {
        return;
      }

      const sanitizedValue = sanitizeSpreadsheetFieldValue(cell, field, currency);

      if (sanitizedValue === null || sanitizedValue === "") {
        return;
      }

      updatedDrafts[draftIndex] = {
        ...updatedDrafts[draftIndex],
        [field]: sanitizedValue,
      };
      handled = true;
    });
  });

  return { drafts: updatedDrafts, handled };
};

export const handleBulkPublishFieldPaste = ({
  event,
  drafts,
  startProductIndex,
  startField,
  showStock,
  currency,
  onChange,
}: {
  event: ClipboardEvent<HTMLElement>;
  drafts: ProductPublishDraft[];
  startProductIndex: number;
  startField: BulkPublishPasteField;
  showStock: boolean;
  currency: string;
  onChange: (drafts: ProductPublishDraft[]) => void;
}): void => {
  const pastedText = event.clipboardData.getData("text/plain");

  if (pastedText === "") {
    return;
  }

  const { drafts: nextDrafts, handled } = applySpreadsheetPasteToDrafts({
    drafts,
    startProductIndex,
    startField,
    pastedText,
    showStock,
    currency,
  });

  if (!handled) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  onChange(nextDrafts);
};
