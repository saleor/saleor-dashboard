import { useUser } from "@dashboard/auth";
import moment from "moment";

export const useNewUserCheck = () => {
  const { user } = useUser();
  const thresholdDateString = process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD;

  if (!user || !thresholdDateString) {
    return {
      isNewUser: false,
    };
  }

  const userJoinedDate = moment(user.dateJoined);
  const thresholdDate = moment(thresholdDateString);

  if (!userJoinedDate.isValid() || !thresholdDate.isValid()) {
    return {
      isNewUser: false,
    };
  }

  return {
    isNewUser: userJoinedDate.isAfter(thresholdDate),
  };
};
