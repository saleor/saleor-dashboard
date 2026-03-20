import {
  type TaxClassCreateErrorFragment,
  type TaxClassDeleteErrorFragment,
  type TaxClassUpdateErrorFragment,
} from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { type CommonError, type CommonErrorCode, getCommonFormFieldErrorMessage } from "./common";

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
