import { type ProductPublishDraft } from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { sanitizeSpreadsheetPrice } from "@dashboard/components/PriceFieldV2/utils";
import {
  parseSpreadsheetClipboard,
  trimEmptyTrailingRows,
} from "@dashboard/utils/spreadsheetPaste/parseSpreadsheetClipboard";
import { type ClipboardEvent } from "react";

// Multi-field paste for bulk publish. Generic parse lives in utils/spreadsheetPaste.
// See docs/follow-ups/spreadsheet-paste-reuse.md

export type BulkPublishPasteField = "price" | "costPrice" | "stock";

export { parseSpreadsheetClipboard };

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

const normalizeIntegerToken = (value: string): string => {
  const cleaned = value
    .trim()
    .replace(/[\s\u00A0]/g, "")
    .replace(/[^\d.,-]/g, "");

  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === ",") {
    return "";
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > lastDot) {
    const integerPart = cleaned.slice(0, lastComma).replace(/[.,]/g, "");
    const decimalPart = cleaned.slice(lastComma + 1).replace(/[.,]/g, "");

    return decimalPart === "" ? integerPart : `${integerPart}.${decimalPart}`;
  }

  if (lastDot > lastComma) {
    const integerPart = cleaned.slice(0, lastDot).replace(/[.,]/g, "");
    const decimalPart = cleaned.slice(lastDot + 1).replace(/[.,]/g, "");

    return decimalPart === "" ? integerPart : `${integerPart}.${decimalPart}`;
  }

  return cleaned.replace(/,/g, "");
};

export const sanitizeSpreadsheetInteger = (value: string): string | null => {
  const normalized = normalizeIntegerToken(value);

  if (normalized === "") {
    return "";
  }

  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return String(Math.trunc(parsed));
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
