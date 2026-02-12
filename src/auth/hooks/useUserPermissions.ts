import { useUser } from "../useUser";

export const useUserPermissions = () => useUser().user?.userPermissions;
