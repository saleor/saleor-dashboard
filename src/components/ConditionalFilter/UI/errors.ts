import { Error } from "./types";

export type ErrorLookup = Record<
  number,
  {
    left: {
      text: string;
      show: boolean;
    };
    right: {
      text: string;
      show: boolean;
    };
    condition: {
      text: string;
      show: boolean;
    };
  }
>;

export const createErrorLookup = (errors: Error[] | undefined): ErrorLookup => {
  const entries = errors?.map(error => [
    error.row,
    {
      left: {
        text: error.leftText ?? "",
        show: !!error.leftText,
      },
      right: {
        text: error.rightText ?? "",
        show: !!error.rightText,
      },
      condition: {
        text: error.conditionText ?? "",
        show: !!error.conditionText,
      },
    },
  ]);

  return entries ? Object.fromEntries(entries) : {};
};

export const getErrorByRowIndex = (errorLookup: ErrorLookup, rowIndex: number) => {
  const possibleError = errorLookup[rowIndex];

  return (
    possibleError ?? {
      left: {
        text: "",
        show: false,
      },
      right: {
        text: "",
        show: false,
      },
      condition: {
        text: "",
        show: false,
      },
    }
  );
};
