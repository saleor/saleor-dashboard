import { StaffErrorFragment } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import getAccountErrorMessage from "./account";

function getStaffErrorMessage(err: StaffErrorFragment, intl: IntlShape): string | undefined {
  return getAccountErrorMessage(err, intl);
}

export default getStaffErrorMessage;
