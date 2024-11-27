import { useUser } from "@dashboard/auth";
import moment from "moment";

export const useNewUserCheck = () => {
  const { user } = useUser();
  const thresholdDateString = process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD || "2024-01-01";

  if (!user) {
    return {
      isNewUser: false,
      isUserLoading: true,
    };
  }

  if (!thresholdDateString) {
    return {
      isNewUser: false,
      isUserLoading: false,
    };
  }

  const userJoinedDate = moment(user.dateJoined);
  const thresholdDate = moment(thresholdDateString);

  if (!userJoinedDate.isValid() || !thresholdDate.isValid()) {
    return {
      isNewUser: false,
      isUserLoading: false,
    };
  }

  return {
    isNewUser: userJoinedDate.isAfter(thresholdDate),
    isUserLoading: false,
  };
};
