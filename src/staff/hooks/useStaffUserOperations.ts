import { useStaffMemberDeleteMutation, useStaffMemberUpdateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { useIntl } from "react-intl";

import { staffListUrl } from "../urls";

export const useStaffUserOperations = () => {
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();
  const [updateStaffMember, updateStaffMemberOpts] = useStaffMemberUpdateMutation({
    onCompleted: data => {
      if (!data.staffUpdate?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "EDihQs", defaultMessage: "Staff member updated" }),
        });
      }
    },
  });
  const [deleteStaffMember, deleteResult] = useStaffMemberDeleteMutation({
    onCompleted: data => {
      if (!data.staffDelete?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "EDihQs", defaultMessage: "Staff member updated" }),
        });
        navigate(staffListUrl());
      }
    },
  });

  return {
    updateStaffMember,
    updateStaffMemberOpts,
    deleteStaffMember,
    deleteResult,
  };
};
