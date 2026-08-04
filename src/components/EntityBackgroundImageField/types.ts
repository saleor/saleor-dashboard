import { type MessageDescriptor } from "react-intl";

export interface EntityBackgroundImage {
  alt: string | null;
  url: string;
}

export interface EntityBackgroundImageFieldMessages {
  hint: MessageDescriptor;
  imageAlt: MessageDescriptor;
  imageAltHelper: MessageDescriptor;
}

export interface EntityBackgroundImageFieldTestIds {
  delete?: string;
  preview?: string;
  root?: string;
}
