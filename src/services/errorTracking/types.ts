export type UserData = {
  id: string;
  email: string;
  username: string;
} | null;

export interface TrackerMethods {
  init: () => boolean;
  setUserData: (userData: UserData) => void;
  captureException: (e: Error) => string | null | undefined;
}

export enum TrackerPermission {
  USER_DATA,
}
