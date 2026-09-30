import { type Dispatch, type Ref, type SetStateAction, useEffect, useRef, useState } from "react";

export type NumericEditorEmpty = symbol | null;

export const parseTypedNumericSeed = (
  initialValue: string | undefined,
): { draft: string; numeric: number | null } => {
  if (initialValue === undefined || initialValue === "") {
    return { draft: "", numeric: null };
  }

  const draft = initialValue.replace(",", ".");
  const numeric = Number.parseFloat(draft);

  return {
    draft,
    numeric: Number.isFinite(numeric) ? numeric : null,
  };
};

export const formatNumericCellDraft = (
  value: number | NumericEditorEmpty | undefined,
  emptyValue: NumericEditorEmpty = null,
): string => {
  if (value === emptyValue || value === null || value === undefined) {
    return "";
  }

  return String(value);
};

interface UseDatagridNumericEdit {
  committedValue: number | NumericEditorEmpty | undefined;
  emptyValue?: NumericEditorEmpty;
  initialValue?: string;
  isHighlighted?: boolean;
  onCommit: (value: number | NumericEditorEmpty) => void;
}

/**
 * Spreadsheet-style numeric overlay: a typed key replaces the cell,
 * Enter/F2 selects the current value, and empty stays empty (not 0).
 */
export const useDatagridNumericEdit = ({
  committedValue,
  emptyValue = null,
  initialValue,
  isHighlighted = false,
  onCommit,
}: UseDatagridNumericEdit): {
  draft: string;
  inputRef: Ref<HTMLInputElement>;
  setDraft: Dispatch<SetStateAction<string>>;
} => {
  const inputRef = useRef<HTMLInputElement>(null);
  const seed = parseTypedNumericSeed(initialValue);
  const [draft, setDraft] = useState(() =>
    seed.draft !== "" ? seed.draft : formatNumericCellDraft(committedValue, emptyValue),
  );

  useEffect(
    function seedTypedKeyOrSelectExisting() {
      if (seed.draft !== "") {
        onCommit(seed.numeric === null ? emptyValue : seed.numeric);

        return;
      }

      if (isHighlighted) {
        inputRef.current?.select();
      }
    },
    // Mount-only: the typed key is applied once when the overlay opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { draft, inputRef, setDraft };
};
