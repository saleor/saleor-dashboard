import {
  TaxClassCreateErrorFragment,
  TaxClassDeleteErrorFragment,
  TaxClassUpdateErrorFragment,
} from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { CommonError, CommonErrorCode, getCommonFormFieldErrorMessage } from "./common";

export type TaxClassError =
  | TaxClassUpdateErrorFragment
  | TaxClassCreateErrorFragment
  | TaxClassDeleteErrorFragment
  | CommonError<CommonErrorCode>;

function getTaxesErrorMessage(
  err: Omit<TaxClassError, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  return getCommonFormFieldErrorMessage(err, intl);
}

export default getTaxesErrorMessage;
