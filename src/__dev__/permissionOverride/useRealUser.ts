// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type UserContext as UserContextValue } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import { useContext } from "react";

/** Auth context without the client-side permission override applied. */
export const useRealUser = (): UserContextValue => useContext(UserContext);
