import { OrderEventFragment } from "@dashboard/graphql/types.generated";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import React from "react";

import TimelineNote from "./TimelineNote";

const wrapperFriendlyDate = new Date("2018-08-07T14:30:40+00:00").toISOString();

describe("TimelineNote", () => {
  it("renders user", () => {
    // Arrange
    const mockedUser = {
      avatar: null,
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
      __typename: "User",
    } satisfies OrderEventFragment["user"];

    // Act
    render(
      <TimelineNote
        app={null}
        user={mockedUser}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("TU")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders user avatar", () => {
    // Arrange
    const mockedUser = {
      avatar: {
        __typename: "Image",
        url: "http://example.com",
      },
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
      __typename: "User",
    } satisfies OrderEventFragment["user"];

    // Act
    const { container } = render(
      <TimelineNote
        app={null}
        user={mockedUser}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    const avatar = container.querySelector("img");
    const initials = screen.queryByText("TU");

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
    expect(initials).toBeNull();
    expect(avatar).toBeInTheDocument();
  });

  it("renders app", () => {
    // Arrange
    const mockedApp = {
      __typename: "App",
      id: "1",
      name: "Test App",
      appUrl: "http://example.com",
      brand: null,
    } satisfies OrderEventFragment["app"];

    // Act
    render(
      <TimelineNote
        app={mockedApp}
        user={null}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Te")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders app avatar", () => {
    // Arrange
    const mockedApp = {
      __typename: "App",
      id: "1",
      name: "Test App",
      appUrl: "http://example.com",
      brand: {
        __typename: "AppBrand",
        logo: {
          __typename: "AppBrandLogo",
          default: "http://example.com",
        },
      },
    } satisfies OrderEventFragment["app"];

    // Act
    const { container } = render(
      <TimelineNote
        app={mockedApp}
        user={null}
        date={wrapperFriendlyDate}
        message="Note"
        hasPlainDate={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    const avatar = container.querySelector("img");
    const initials = screen.queryByText("TU");

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
    expect(initials).toBeNull();
    expect(avatar).toBeInTheDocument();
  });
});
