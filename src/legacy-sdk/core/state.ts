import { USER } from "../apollo/queries";
import { type UserQuery } from "../apollo/types";
import { type SaleorClientInternals } from "./types";

export type State = UserQuery | null;

export const getState = (client: SaleorClientInternals["apolloClient"]): State =>
  client.readQuery<UserQuery>({
    query: USER,
  });
