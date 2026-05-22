import { AccountErrorCode, type AccountErrorFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { NewPasswordPage } from "./NewPasswordPage";

type Props = ComponentProps<typeof NewPasswordPage>;

const serverErrors: AccountErrorFragment[] = [
  {
    __typename: "AccountError",
    code: AccountErrorCode.PASSWORD_TOO_SHORT,
    field: "password",
    message: "Password is too short.",
    addressType: null,
  },
];

const meta: Meta<typeof NewPasswordPage> = {
  title: "Auth / NewPasswordPage",
  component: NewPasswordPage,
  args: {
    loading: false,
    errors: [],
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof NewPasswordPage>;

export const Default: Story = {};

export const WithServerErrors: Story = {
  args: {
    errors: serverErrors,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("button-bar-confirm")).toBeDisabled();
  },
};

export const SubmitsValidPasswords: Story = {
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Props }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId("password"), "super-secret-1");
    await userEvent.type(canvas.getByTestId("confirm-password"), "super-secret-1");
    await userEvent.click(canvas.getByTestId("button-bar-confirm"));

    await expect(args.onSubmit).toHaveBeenCalledOnce();
    await expect(args.onSubmit).toHaveBeenCalledWith(
      {
        password: "super-secret-1",
        confirmPassword: "super-secret-1",
      },
      expect.anything(),
    );
  },
};

export const ShowsErrorWhenPasswordsDoNotMatch: Story = {
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Props }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId("password"), "super-secret-1");
    await userEvent.type(canvas.getByTestId("confirm-password"), "different-2");
    await userEvent.click(canvas.getByTestId("button-bar-confirm"));

    await expect(await canvas.findByText("Passwords do not match")).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
