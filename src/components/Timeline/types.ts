export interface UserActor {
  type: "user";
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AppActor {
  type: "app";
  id: string;
  name?: string | null;
}

export type Actor = UserActor | AppActor;
