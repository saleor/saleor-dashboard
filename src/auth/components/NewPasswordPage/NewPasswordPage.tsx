import { type AccountErrorFragment } from "@dashboard/graphql";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { newPasswordPageMessages } from "./messages";
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

export const NewPasswordPage = ({ loading, errors, onSubmit }: NewPasswordPageProps) => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={6}>
        <Text size={6} fontWeight="bold" lineHeight={3}>
          <FormattedMessage {...newPasswordPageMessages.title} />
        </Text>
        {errors.length > 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            {errors.map(error => (
              <Box
                borderRadius={4}
                padding={4}
                backgroundColor="critical1"
                width="100%"
                key={`${error.code}-${error.field}`}
              >
                {getAccountErrorMessage(error, intl)}
              </Box>
            ))}
          </Box>
        )}
        <Text size={4} fontWeight="light" color="default2" display="block">
          <FormattedMessage {...newPasswordPageMessages.description} />
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              width="100%"
              autoComplete="new-password"
              disabled={loading}
              label={intl.formatMessage(newPasswordPageMessages.newPasswordLabel)}
              type="password"
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
            <Input
              {...field}
              width="100%"
              autoComplete="new-password"
              disabled={loading}
              label={intl.formatMessage(newPasswordPageMessages.confirmPasswordLabel)}
              type="password"
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword?.message}
              data-test-id="confirm-password"
              spellCheck={false}
              required
            />
          )}
        />
        <Button
          data-test-id="button-bar-confirm"
          width="100%"
          disabled={loading}
          variant="primary"
          type="submit"
        >
          <FormattedMessage {...newPasswordPageMessages.submitButton} />
        </Button>
      </Box>
    </form>
  );
};
