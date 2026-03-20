import { useUser } from "../useUser";

export const useUserAccessibleChannels = () => {
  const user = useUser();

  if (!user?.user?.accessibleChannels) {
    return [];
  }

  return user.user.accessibleChannels;
};
