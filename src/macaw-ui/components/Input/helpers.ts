import { KeyboardEvent } from "react";

import { InputProps } from "./Input";
import { InputValue } from "./types";

// Check if input type number is valid as input type number doesn't currently work in browsers like Safari and Firefox
export const checkIfValidNumberInput = (event: KeyboardEvent<HTMLElement>) => {
  const allowedCharacter =
    /^[\d.,]*$|(Backspace|Tab|Delete|ArrowLeft|ArrowRight|ArrowDown|ArrowUp)/;

  return !event.key.match(allowedCharacter) && event.preventDefault();
};

export const isInputTyped = (
  type: InputProps["type"],
  value: InputValue,
  active: boolean
): boolean => {
  // do not scale label down if input is date, time or datetime-local
  if (checkIfDateTimeInput(type)) {
    return true;
  }

  if (value !== "" && value !== undefined) {
    return true;
  }

  return active;
};

const checkIfDateTimeInput = (type: InputProps["type"]) =>
  ["date", "time", "datetime-local"].includes(type ?? "");
