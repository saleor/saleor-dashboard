import { USER } from "../apollo/queries";
import { UserQuery } from "../apollo/types";
import { SaleorClientInternals } from "./types";

export type State = UserQuery | null;

export const getState = (client: SaleorClientInternals["apolloClient"]): State =>
  client.readQuery<UserQuery>({
    query: USER,
  });
