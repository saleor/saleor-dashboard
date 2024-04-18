// @ts-strict-ignore
import { getApiUrl } from "@dashboard/config";
import LzString from "lz-string";

export type EditorContent = Record<keyof typeof longKeysToShortKeys, string>;

type ShorterEditorContent = Record<
  (typeof longKeysToShortKeys)[keyof typeof longKeysToShortKeys],
  string
>;

export function removeEmptyValues<T extends object>(editorContent: T): Partial<T> {
  return Object.fromEntries(Object.entries(editorContent).filter(([, val]) => !!val)) as Partial<T>;
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
    stringifiedContent === "{}" ? "" : LzString.compressToEncodedURIComponent(stringifiedContent);

  return `saleor/${editorContentToSaveInUrl}`;
};

interface PlaygroundOpenHandlerInput {
  query: string;
  headers: string;
  operationName: string;
  variables: string;
}

const thisURL = new URL(getApiUrl(), window.location.origin).href;

export const playgroundOpenHandler =
  ({ query, headers, operationName, variables }: PlaygroundOpenHandlerInput) =>
  () => {
    const playgroundURL = new URL(thisURL);
    playgroundURL.hash = encodeGraphQLStatement({
      query,
      headers,
      operationName,
      variables,
    });
    window.open(playgroundURL, "_blank").focus();
  };
