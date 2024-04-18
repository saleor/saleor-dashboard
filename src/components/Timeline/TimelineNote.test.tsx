import { OrderEventFragment } from "@dashboard/graphql/types.generated";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import React from "react";

import TimelineNote from "./TimelineNote";

const wrapperFriendlyDate = new Date("2018-08-07T14:30:40+00:00").toISOString();

describe("TimelineNote", () => {
  it("renders user", () => {
    const mockedUser = {
      avatar: null,
      id: "1",
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
      __typename: "User",
    } satisfies OrderEventFragment["user"];

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

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("TU")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders user avatar", () => {
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

    const avatar = container.querySelector("img");
    const initials = screen.queryByText("TU");

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
    expect(initials).toBeNull();
    expect(avatar).toBeInTheDocument();
  });

  it("renders app", () => {
    const mockedApp = {
      __typename: "App",
      id: "1",
      name: "Test App",
      appUrl: "http://example.com",
      brand: null,
    } satisfies OrderEventFragment["app"];

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

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Te")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders app avatar", () => {
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

    const avatar = container.querySelector("img");
    const initials = screen.queryByText("TU");

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
    expect(initials).toBeNull();
    expect(avatar).toBeInTheDocument();
  });
});
