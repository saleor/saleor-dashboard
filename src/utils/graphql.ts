import LzString from "lz-string";

export type EditorContent = Record<keyof typeof longKeysToShortKeys, string>;

type ShorterEditorContent = Record<
  typeof longKeysToShortKeys[keyof typeof longKeysToShortKeys],
  string
>;

export function removeEmptyValues<T extends object>(
  editorContent: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(editorContent).filter(([, val]) => !!val),
  ) as Partial<T>;
}

const longKeysToShortKeys = {
  query: "q",
  headers: "h",
  operationName: "o",
  variables: "v",
} as const;

export const encodeGraphQLStatement = (editorContent: EditorContent) => {
  const shorterContent: ShorterEditorContent = {
    q: editorContent.query,
    h: editorContent.headers,
    o: editorContent.operationName,
    v: editorContent.variables,
  };
  const stringifiedContent = JSON.stringify(removeEmptyValues(shorterContent));

  const editorContentToSaveInUrl =
    stringifiedContent === "{}"
      ? ""
      : LzString.compressToEncodedURIComponent(stringifiedContent);

  return `saleor/${editorContentToSaveInUrl}`;
};
