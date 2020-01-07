import { FilterOpts } from "@saleor/types";
import { StaffMemberStatus } from "@saleor/types/globalTypes";

export interface StaffListFilterOpts {
  status: FilterOpts<StaffMemberStatus>;
}
