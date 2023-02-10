import {
  useStaffMemberDeleteMutation,
  useStaffMemberUpdateMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { useIntl } from "react-intl";

import { staffListUrl } from "../urls";

export const useStaffUserOperations = () => {
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();

  const [
    updateStaffMember,
    updateStaffMemberOpts,
  ] = useStaffMemberUpdateMutation({
    onCompleted: data => {
      if (!data.staffUpdate?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const [deleteStaffMember, deleteResult] = useStaffMemberDeleteMutation({
    onCompleted: data => {
      if (!data.staffDelete?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
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
