import Wrapper from "@test/wrapper";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { TimelineNote } from "./TimelineNote";
import { Actor } from "./types";

const wrapperFriendlyDate = new Date("2018-08-07T14:30:40+00:00").toISOString();

// Wrapper with Router for tests that include user links
const WrapperWithRouter = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

describe("TimelineNote", () => {
  it("renders user", () => {
    // Arrange
    const userActor: Actor = {
      type: "user",
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
    };

    // Act
    render(
      <TimelineNote
        actor={userActor}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
      />,
      { wrapper: WrapperWithRouter },
    );

    // Assert
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders app", () => {
    // Arrange
    const appActor: Actor = {
      type: "app",
      id: "1",
      name: "Test App",
    };

    // Act
    render(
      <TimelineNote
        actor={appActor}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
      />,
      { wrapper: WrapperWithRouter },
    );

    // Assert
    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders note id and refer id", () => {
    // Arrange
    const noteId = "T3JkZXJFdmVudDozNDM3";
    const noteRelatedId = "T3JkZXJFdmVudDozNDQx";
    const userActor: Actor = {
      type: "user",
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
    };

    // Act
    const { container } = render(
      <TimelineNote
        actor={userActor}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
        id={noteId}
        relatedId={noteRelatedId}
      />,
      { wrapper: WrapperWithRouter },
    );

    // Assert
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
    // Note id is now used as HTML id attribute instead of displayed text
    expect(container.querySelector(`#timeline-note-${noteId}`)).toBeInTheDocument();
    // For edited notes, "edited" text with link icon is shown instead of "added"
    expect(screen.getByText("edited")).toBeInTheDocument();
  });

  it("should edit note", async () => {
    // Arrange
    const noteId = "T3JkZXJFdmVudDozNDM3";
    const noteRelatedId = "T3JkZXJFdmVudDozNDQx";
    const onNoteUpdate = jest.fn();
    const onNoteUpdateLoading = false;
    const userActor: Actor = {
      type: "user",
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
    };

    render(
      <TimelineNote
        actor={userActor}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
        id={noteId}
        relatedId={noteRelatedId}
        onNoteUpdate={onNoteUpdate}
        onNoteUpdateLoading={onNoteUpdateLoading}
      />,
      { wrapper: WrapperWithRouter },
    );

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId("edit-note"));
    });

    await act(async () => {
      await userEvent.clear(screen.getByRole("textbox"));
      await userEvent.type(screen.getByRole("textbox"), "New note");
      await userEvent.click(screen.getByRole("button", { name: /save/i }));
    });

    // Assert
    expect(onNoteUpdate).toHaveBeenCalledWith(noteId, "New note");
  });
});
