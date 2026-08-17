import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { EntityBackgroundImageField } from "./EntityBackgroundImageField";
import { type EntityBackgroundImage } from "./types";

const meta: Meta<typeof EntityBackgroundImageField> = {
  title: "Components / EntityBackgroundImageField",
  component: EntityBackgroundImageField,
};

export default meta;
type Story = StoryObj<typeof EntityBackgroundImageField>;

const sampleImage: EntityBackgroundImage = {
  alt: "Summer collection banner",
  url: "https://placehold.co/800x200",
};

const StatefulField = ({
  image,
  disabled,
}: {
  disabled?: boolean;
  image: EntityBackgroundImage | null | undefined;
}): JSX.Element => {
  const [alt, setAlt] = useState(image?.alt ?? "");

  return (
    <EntityBackgroundImageField
      backgroundImageAlt={alt}
      disabled={disabled}
      image={image}
      onAltChange={event => setAlt(event.target.value)}
      onImageDelete={() => undefined}
      onImageUpload={() => undefined}
    />
  );
};

export const Empty: Story = {
  render: () => <StatefulField image={null} />,
};

export const WithImage: Story = {
  render: () => <StatefulField image={sampleImage} />,
};

export const Loading: Story = {
  render: () => <StatefulField image={undefined} />,
};

export const Uploading: Story = {
  render: () => (
    <EntityBackgroundImageField
      backgroundImageAlt=""
      image={null}
      isUploading
      uploadPreviewUrl="https://placehold.co/800x200"
      onAltChange={() => undefined}
      onImageDelete={() => undefined}
      onImageUpload={() => undefined}
    />
  ),
};

export const UploadingReplace: Story = {
  render: () => (
    <EntityBackgroundImageField
      backgroundImageAlt="Summer collection banner"
      image={sampleImage}
      isUploading
      uploadPreviewUrl="https://placehold.co/800x400"
      onAltChange={() => undefined}
      onImageDelete={() => undefined}
      onImageUpload={() => undefined}
    />
  ),
};

export const Disabled: Story = {
  render: () => <StatefulField disabled image={sampleImage} />,
};
