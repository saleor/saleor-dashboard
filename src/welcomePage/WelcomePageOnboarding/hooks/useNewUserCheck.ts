import { useUser } from "@dashboard/auth/useUser";

export const useNewUserCheck = () => {
  const { user } = useUser();
  const thresholdDateString = process.env.ONBOARDING_USER_JOINED_DATE_THRESHOLD || "2024-11-29";

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

  const userJoinedDate = new Date(user.dateJoined);
  // Reset time, so timezone will not flip the day
  const thresholdDate = new Date(`${thresholdDateString}T00:00:00`);

  if (isNaN(userJoinedDate.getTime()) || isNaN(thresholdDate.getTime())) {
    return {
      isNewUser: false,
      isUserLoading: false,
    };
  }

  return {
    isNewUser: userJoinedDate > thresholdDate,
    isUserLoading: false,
  };
};
