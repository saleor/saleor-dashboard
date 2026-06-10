import { type IntlShape } from "react-intl";
import { z } from "zod";

import { newPasswordValidationMessages } from "./messages";

export const getNewPasswordSchema = (intl: IntlShape) =>
  z
    .object({
      password: z.string().min(1, {
        message: intl.formatMessage(newPasswordValidationMessages.passwordRequired),
      }),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: intl.formatMessage(newPasswordValidationMessages.passwordsDoNotMatch),
      path: ["confirmPassword"],
    });

export type NewPasswordPageFormData = Required<z.infer<ReturnType<typeof getNewPasswordSchema>>>;
