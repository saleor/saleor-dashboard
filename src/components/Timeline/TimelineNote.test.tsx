import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import React from "react";

import TimelineNote from "./TimelineNote";

const wrapperFriendlyDate = new Date("2018-08-07T14:30:40+00:00").toISOString();

describe("TimelineNote", () => {
  it("renders user", () => {
    render(
      <Wrapper>
        <TimelineNote
          app={undefined}
          user={{
            avatar: undefined,
            id: "1",
            email: "test@test.com",
            firstName: "Test",
            lastName: "User",
            __typename: "User",
          }}
          date={wrapperFriendlyDate}
          message="Note"
          hasPlainDate={false}
        />
      </Wrapper>,
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("TU")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders user avatar", () => {
    const { container } = render(
      <Wrapper>
        <TimelineNote
          app={undefined}
          user={{
            avatar: {
              __typename: "Image",
              url: "http://example.com",
            },
            id: "1",
            email: "test@test.com",
            firstName: "Test",
            lastName: "User",
            __typename: "User",
          }}
          date={wrapperFriendlyDate}
          message="Note"
          hasPlainDate={false}
        />
      </Wrapper>,
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
    render(
      <Wrapper>
        <TimelineNote
          app={{
            __typename: "App",
            id: "1",
            name: "Test App",
            appUrl: "http://example.com",
            brand: undefined,
          }}
          user={undefined}
          date={wrapperFriendlyDate}
          message="Note"
          hasPlainDate={false}
        />
      </Wrapper>,
    );

    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Te")).toBeInTheDocument();
    expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
  });

  it("renders app avatar", () => {
    const { container } = render(
      <Wrapper>
        <TimelineNote
          app={{
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
          }}
          user={undefined}
          date={wrapperFriendlyDate}
          message="Note"
          hasPlainDate={false}
        />
      </Wrapper>,
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
