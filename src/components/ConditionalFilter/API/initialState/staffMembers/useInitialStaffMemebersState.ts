import { StaffMemberStatus } from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { StaffMembersFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { EnumValuesHandler } from "../../Handler";
import { InitialStaffMembersStateResponse } from "./InitialStaffMembersState";

export interface InitialStaffMembersAPIState {
  data: InitialStaffMembersStateResponse;
  loading: boolean;
  fetchQueries: (params: StaffMembersFetchingParams) => Promise<void>;
}

export const useInitialStaffMembersState = (): InitialStaffMembersAPIState => {
  const intl = useIntl();
  const [data, setData] = useState<InitialStaffMembersStateResponse>(
    InitialStaffMembersStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const fetchQueries = async ({ staffMemberStatus }: StaffMembersFetchingParams) => {
    const staffMemberStatusInit = new EnumValuesHandler(
      StaffMemberStatus,
      "staffMemberStatus",
      intl,
      staffMemberStatus,
    );

    const initialState = {
      staffMemberStatus: await staffMemberStatusInit.fetch(),
    };

    setData(new InitialStaffMembersStateResponse(initialState.staffMemberStatus));
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
