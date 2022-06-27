import { StaffErrorFragment } from "@saleor/graphql";
import { IntlShape } from "react-intl";

import getAccountErrorMessage from "./account";

function getStaffErrorMessage(
  err: StaffErrorFragment,
  intl: IntlShape,
): string {
  return getAccountErrorMessage(err, intl);
}

export default getStaffErrorMessage;
