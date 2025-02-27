import { MetadataInput } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Control } from "react-hook-form";
import { IntlShape, MessageDescriptor } from "react-intl";

import { MetadataHookForm } from "./MetadataHookForm";

jest.mock("react-intl", () => ({
  FormattedMessage: (props: MessageDescriptor) => <>{props.defaultMessage || props.id || ""}</>,
  defineMessages: (messages: Record<string, MessageDescriptor>) => messages,
  useIntl: (): Pick<IntlShape, "formatMessage"> => ({
    formatMessage: ({ defaultMessage }: MessageDescriptor) => defaultMessage || "",
  }),
}));

const mockData = {
  privateMetadata: [
    { key: "private-metadata", value: "private-metadata-value" },
  ] as MetadataInput[],
  metadata: [
    {
      key: "metadata",
      value: "metadata-value",
    },
  ] as MetadataInput[],
} as const;

const mockHookFormProps = {
  control: {} as Control<any>,
  getValues: jest.fn(),
  trigger: jest.fn(),
};

jest.mock("./useMetadataFormControls", () => ({
  useMetadataFormControls: () => ({
    metadataFields: mockData.metadata,
    privateMetadataFields: mockData.privateMetadata,
    handleMetadataChange: jest.fn(),
    handlePrivateMetadataChange: jest.fn(),
  }),
}));

describe("MetadataHookForm", () => {
  it("displays loading state", () => {
    // Arrange
    render(<MetadataHookForm isLoading={true} {...mockHookFormProps} />);

    // Assert, There are multiple skeletons, check if there's at least one
    expect(screen.queryAllByTestId("skeleton")?.[0]).toBeInTheDocument();
  });

  it("displays metadata", async () => {
    // Arrange
    render(<MetadataHookForm isLoading={false} {...mockHookFormProps} />);

    // Act, First button is for metadata
    const metadataButton = screen.getAllByTestId("expand")[0];

    await userEvent.click(metadataButton);

    // Assert
    expect(screen.getByDisplayValue(mockData.metadata[0].value)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockData.metadata[0].key)).toBeInTheDocument();
  });

  it("displays private metadata when not hidden", async () => {
    // Arrange
    render(<MetadataHookForm isLoading={false} {...mockHookFormProps} />);

    // Act, Second button is for privateMetadata
    const metadataButton = screen.getAllByTestId("expand")[1];

    await userEvent.click(metadataButton);

    // Assert
    expect(screen.getByDisplayValue(mockData.privateMetadata[0].value)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockData.privateMetadata[0].key)).toBeInTheDocument();
  });

  it("doesn't display private metadata when hidden", async () => {
    // Arrange
    render(
      <MetadataHookForm isLoading={false} hidePrivateMetadata={true} {...mockHookFormProps} />,
    );

    // Assert
    expect(screen.queryByText("Private Metadata")).not.toBeInTheDocument();
  });
});
