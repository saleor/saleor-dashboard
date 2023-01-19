export function removeEmptyValues<T extends object>(
  editorContent: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(editorContent).filter(([, val]) => !!val)
  ) as Partial<T>;
}
