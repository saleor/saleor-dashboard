import { type AccountErrorFragment } from "@dashboard/graphql";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { AuthButton } from "../AuthButton/AuthButton";
import { AuthField } from "../AuthField/AuthField";
import { AuthNotice } from "../AuthNotice/AuthNotice";
import { AuthWell } from "../AuthWell/AuthWell";
import { newPasswordPageMessages } from "./messages";
import styles from "./NewPasswordPage.module.css";
import { getNewPasswordSchema, type NewPasswordPageFormData } from "./validationSchema";

export { type NewPasswordPageFormData };

interface NewPasswordPageProps {
  loading: boolean;
  errors: AccountErrorFragment[];
  onSubmit: (data: NewPasswordPageFormData) => Promise<void>;
}

const defaultValues: NewPasswordPageFormData = {
  password: "",
  confirmPassword: "",
};

export const NewPasswordPage = ({ loading, errors, onSubmit }: NewPasswordPageProps): ReactNode => {
  const intl = useIntl();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<NewPasswordPageFormData>({
    mode: "onSubmit",
    defaultValues,
    resolver: zodResolver(getNewPasswordSchema(intl)),
  });

  return (
    <AuthWell>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FormattedMessage {...newPasswordPageMessages.title} />
        </h1>
        <p className={styles.lede}>
          <FormattedMessage {...newPasswordPageMessages.description} />
        </p>
      </div>

      {errors.length > 0 && (
        <div className={styles.notices}>
          {errors.map(error => (
            <AuthNotice tone="error" key={`${error.code}-${error.field}`}>
              {getAccountErrorMessage(error, intl)}
            </AuthNotice>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <AuthField
                {...field}
                id="password"
                autoFocus
                autoComplete="new-password"
                disabled={loading}
                label={intl.formatMessage(newPasswordPageMessages.newPasswordLabel)}
                showPasswordToggle
                showPasswordLabel={intl.formatMessage(newPasswordPageMessages.showPassword)}
                hidePasswordLabel={intl.formatMessage(newPasswordPageMessages.hidePassword)}
                error={!!formErrors.password}
                helperText={formErrors.password?.message}
                data-test-id="password"
                spellCheck={false}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <AuthField
                {...field}
                id="confirmPassword"
                autoComplete="new-password"
                disabled={loading}
                label={intl.formatMessage(newPasswordPageMessages.confirmPasswordLabel)}
                showPasswordToggle
                showPasswordLabel={intl.formatMessage(newPasswordPageMessages.showPassword)}
                hidePasswordLabel={intl.formatMessage(newPasswordPageMessages.hidePassword)}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword?.message}
                data-test-id="confirm-password"
                spellCheck={false}
                required
              />
            )}
          />

          <AuthButton
            className={styles.actionButton}
            data-test-id="button-bar-confirm"
            loading={loading}
            variant="primary"
            type="submit"
          >
            <FormattedMessage {...newPasswordPageMessages.submitButton} />
          </AuthButton>
        </div>
      </form>

      <p className={styles.help}>
        <FormattedMessage {...newPasswordPageMessages.passwordHint} />
      </p>
    </AuthWell>
  );
};

NewPasswordPage.displayName = "NewPasswordPage";
