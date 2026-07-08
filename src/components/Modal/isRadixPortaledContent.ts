export const isRadixPortaledContent = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.closest("[data-radix-popper-content-wrapper]") !== null ||
    target.closest("[data-radix-menu-content]") !== null ||
    target.closest("[data-radix-select-content]") !== null ||
    target.closest("[data-macaw-ui-component='Popover.Content']") !== null
  );
};
