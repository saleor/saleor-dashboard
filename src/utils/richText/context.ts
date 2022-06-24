import { createContext, useContext } from "react";

import { useRichText } from "./useRichText";

export type RichTextContextValues = ReturnType<typeof useRichText>;

export const RichTextContext = createContext<RichTextContextValues | null>(
  null,
);

export const useRichTextContext = () => {
  const value = useContext(RichTextContext);
  if (!value) {
    throw new Error("useRichTextContext used outside of RichTextContext");
  }

  return value;
};
