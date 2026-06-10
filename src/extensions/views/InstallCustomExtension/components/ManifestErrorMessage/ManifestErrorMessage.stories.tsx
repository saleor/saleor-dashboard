import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FieldError } from "react-hook-form";

import { MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT } from "../../schema";
import { ManifestErrorMessage } from "./ManifestErrorMessage";

const meta: Meta<typeof ManifestErrorMessage> = {
  title: "Extensions/InstallCustomExtension/ManifestErrorMessage",
  component: ManifestErrorMessage,
};

export default meta;
type Story = StoryObj<typeof ManifestErrorMessage>;

const clientFormatError: FieldError = {
  type: "validate",
  message: MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT,
};

const backendError: FieldError = {
  type: "MANIFEST_URL_CANT_CONNECT",
  message: "Cannot connect to manifest URL",
};

const plainError: FieldError = {
  type: "validate",
  message: "Something went wrong while parsing the manifest.",
};

export const ClientValidation: Story = {
  args: { error: clientFormatError },
};

export const BackendError: Story = {
  args: { error: backendError },
};

export const PlainMessage: Story = {
  args: { error: plainError },
};

export const NoError: Story = {
  args: { error: null },
};
