import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FileUploadField } from "./FileUploadField";
import { UPLOADED_FILE } from "./fixtures";

describe("FileUploadField", () => {
  it("shows an empty dropzone hint", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <FileUploadField
          disabled={false}
          loading={false}
          file={{ label: "", value: "" }}
          onFileUpload={jest.fn()}
          onFileDelete={jest.fn()}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("button-upload-file")).toHaveTextContent(
      "Drag and drop or click to upload",
    );
    expect(screen.getByTestId("file-upload-dropzone")).toBeInTheDocument();
  });

  it("uploads a file selected via the hidden input", async () => {
    // Arrange
    const onFileUpload = jest.fn();

    render(
      <Wrapper>
        <FileUploadField
          disabled={false}
          loading={false}
          file={{ label: "", value: "" }}
          onFileUpload={onFileUpload}
          onFileDelete={jest.fn()}
        />
      </Wrapper>,
    );

    const file = new File(["bytes"], "hero.png", { type: "image/png" });

    // Act
    await userEvent.upload(screen.getByTestId("upload-file-input"), file);

    // Assert
    expect(onFileUpload).toHaveBeenCalledTimes(1);
    expect(onFileUpload.mock.calls[0][0]).toEqual(file);
  });

  it("shows the uploaded image thumbnail, file name, and delete control", () => {
    // Arrange
    const onFileDelete = jest.fn();

    render(
      <Wrapper>
        <FileUploadField
          disabled={false}
          loading={false}
          file={{
            label: "hero.png",
            value: "file-1",
            file: UPLOADED_FILE,
          }}
          onFileUpload={jest.fn()}
          onFileDelete={onFileDelete}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("hero.png")).toBeInTheDocument();
    expect(screen.getByTestId("file-upload-thumbnail")).toHaveAttribute("src", UPLOADED_FILE.url);
    expect(screen.getByTestId("button-delete-file")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByTestId("button-delete-file"));

    // Assert
    expect(onFileDelete).toHaveBeenCalled();
  });

  it("does not show a thumbnail for non-image files", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <FileUploadField
          disabled={false}
          loading={false}
          file={{
            label: "notes.pdf",
            value: "file-2",
            file: {
              __typename: "File",
              url: "https://example.com/notes.pdf",
              contentType: "application/pdf",
            },
          }}
          onFileUpload={jest.fn()}
          onFileDelete={jest.fn()}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("file-upload-thumbnail")).not.toBeInTheDocument();
    expect(screen.getByText("notes.pdf")).toBeInTheDocument();
  });

  it("renders the label as plain text when the file has no URL", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <FileUploadField
          disabled={false}
          loading={false}
          file={{
            label: "pending-upload.png",
            value: "pending",
          }}
          onFileUpload={jest.fn()}
          onFileDelete={jest.fn()}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("pending-upload.png")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-upload-thumbnail")).not.toBeInTheDocument();
  });
});
