import { StaffErrorFragment } from "@saleor/fragments/types/StaffErrorFragment";
import { IntlShape } from "react-intl";

import getAccountErrorMessage from "./account";

function getStaffErrorMessage(
  err: StaffErrorFragment,
  intl: IntlShape
): string {
  return getAccountErrorMessage(
    err && {
      ...err,
      __typename: "AccountError"
    },
    intl
  );
}

export default getStaffErrorMessage;
