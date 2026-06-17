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

/** Stops single-line inputs from implicitly submitting a parent <form> on plain Enter. */
export const preventPlainEnterSubmit = (event: ReactKeyboardEventLike, enabled = true): void => {
  if (!enabled || event.key !== "Enter" || isCmdEnter(event)) {
    return;
  }

  event.preventDefault();
};
