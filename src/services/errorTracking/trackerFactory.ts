import { TrackerMethods, TrackerPermission, UserData } from "./types";

type ErrorTrackerFactory = (
  ExtensionFactory: TrackerMethods,
  permissions?: TrackerPermission[],
) => TrackerMethods;

export const ErrorTrackerFactory: ErrorTrackerFactory = (
  extension,
  permissions = [],
) => {
  let ENABLED = false;

  const safelyInvoke = <T extends () => any>(
    fn: T,
    permission?: TrackerPermission,
  ): ReturnType<T> => {
    const hasPermission =
      permission !== undefined ? permissions.includes(permission) : true;

    if (ENABLED && hasPermission) {
      try {
        return fn();
      } catch (e) {
        throw new Error(`Tracking Extension Error: ${e}`);
      }
    }
  };

  const init: TrackerMethods["init"] = () => {
    if (!ENABLED) {
      ENABLED = extension.init();
    }

    return ENABLED;
  };

  const setUserData: TrackerMethods["setUserData"] = (userData: UserData) =>
    safelyInvoke(
      () => extension.setUserData(userData),
      TrackerPermission.USER_DATA,
    );

  const captureException: TrackerMethods["captureException"] = (e: Error) =>
    safelyInvoke(() => extension.captureException(e));

  return {
    captureException,
    init,
    setUserData,
  };
};
