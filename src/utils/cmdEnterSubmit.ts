type KeyboardEventLike = Pick<KeyboardEvent, "metaKey" | "ctrlKey" | "key">;

type ReactKeyboardEventLike = KeyboardEventLike & {
  preventDefault: () => void;
};

export const isCmdEnter = (event: KeyboardEventLike): boolean =>
  (event.metaKey || event.ctrlKey) && event.key === "Enter";

export const createCmdEnterSubmitHandler =
  (submit: () => void, enabled = true) =>
  (event: ReactKeyboardEventLike): void => {
    if (!enabled || !isCmdEnter(event)) {
      return;
    }

    event.preventDefault();
    submit();
  };
