import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { HookFormInput } from "./HookFormInput";

const meta: Meta<typeof HookFormInput> = {
  title: "Components/HookFormInput",
  component: HookFormInput,
};

export default meta;
type Story = StoryObj<typeof HookFormInput>;

const FormWrapper = ({ errorMessage }: { errorMessage?: string }) => {
  const { control, setError } = useForm<{ name: string }>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (errorMessage) {
      setError("name", { type: "manual", message: errorMessage });
    }
  }, [errorMessage, setError]);

  return (
    <div style={{ width: 360 }}>
      <HookFormInput name="name" control={control} label="Name" placeholder="Enter a name" />
    </div>
  );
};

export const Default: Story = {
  render: () => <FormWrapper />,
};

export const WithError: Story = {
  render: () => <FormWrapper errorMessage="This field is required" />,
};
