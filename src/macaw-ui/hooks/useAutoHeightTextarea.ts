import { useLayoutEffect } from "react";
import { TextareaValue } from "../components/Textarea/TextareaWrapper";

// Updates the height of a <textarea> when the value changes.
export const useAutoHeightTextarea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: TextareaValue,
  rows: number,
  maxRows: number
) => {
  // Use useLayoutEffect to avoid calling getComputedStyle during render
  // which causes React error #185 in React 18's useSyncExternalStore
  useLayoutEffect(() => {
    if (textAreaRef) {
      const intialHeight = getHeight(textAreaRef, rows);
      const maxRowsHeight = getHeight(textAreaRef, maxRows);

      // Restart the height at 0px to ensure that the scroll height is correct.
      textAreaRef.style.height = "0px";

      // Take the max of the initial height and the scroll height for case where rows is greater than one.
      const initMaxHeight = Math.max(intialHeight, textAreaRef.scrollHeight);
      // Take the scroll height but limit it to the max rows height.
      const scrollHeight = Math.min(initMaxHeight, maxRowsHeight);

      textAreaRef.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, value, rows, maxRows]);
};

function getHeight(textAreaRef: HTMLTextAreaElement | null, rows: number) {
  if (textAreaRef) {
    return parseFloat(getComputedStyle(textAreaRef).lineHeight) * rows;
  }
  return 0;
}
