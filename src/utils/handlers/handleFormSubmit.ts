async function handleFormSubmit<T>(
  data: T,
  onSubmit: (data: T) => Promise<boolean>,
  setChanged: (changed: boolean) => void
): Promise<boolean> {
  const ok = await onSubmit(data);

  if (ok) {
    setChanged(false);
  }

  return ok;
}
