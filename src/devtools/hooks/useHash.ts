import { useEffect, useState } from "react"
import LzString from 'lz-string';
import copy from "copy-to-clipboard"

import { removeEmptyValues } from '../helpers/removeEmptyValues';

export type EditorContent = Record<keyof typeof longKeysToShortKeys, string>;
type ShorterEditorContent = Record<
  (typeof longKeysToShortKeys)[keyof typeof longKeysToShortKeys],
  string
>;

const longKeysToShortKeys = {
  query: 'q',
  headers: 'h',
  operationName: 'o',
  variables: 'v',
} as const;

export const editorContentToUrlFragment = (editorContent: EditorContent) => {
  const shorterContent: ShorterEditorContent = {
    q: editorContent.query,
    h: editorContent.headers,
    o: editorContent.operationName,
    v: editorContent.variables,
  };
  const stringifiedContent = JSON.stringify(removeEmptyValues(shorterContent));

  const editorContentToSaveInUrl =
    stringifiedContent === '{}'
      ? ''
      : LzString.compressToEncodedURIComponent(stringifiedContent);

  return `gql/${editorContentToSaveInUrl}`;
};

const useHash = () => {
  const [hashed, setHashed] = useState(false)

  useEffect(() => {
    if (hashed) {
      const timeout = setTimeout(() => setHashed(false), 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [hashed])

  return {
    isHashed: hashed,
    hash: (content: EditorContent) => {
      setHashed(true)
      const hashed = editorContentToUrlFragment(content)
      copy(hashed)
    },
  }
}

export default useHash
