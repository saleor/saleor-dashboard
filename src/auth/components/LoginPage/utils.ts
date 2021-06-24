import { DEMO_MODE } from "@saleor/config";

import { LoginFormData } from "./types";

export const getLoginFormInitialData = (): LoginFormData => {
  if (DEMO_MODE) {
    return {
      email: "admin@example.com",
      password: "admin"
    };
  }
  return { email: "", password: "" };
};
