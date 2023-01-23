import { appAvatar } from "@dashboard/apps/fixtures";
import { appPath } from "@dashboard/apps/urls";
import { staffMemberAvatar } from "@dashboard/staff/fixtures";
import { staffMemberDetailsPath } from "@dashboard/staff/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";

import { EventCreatedBy } from "./EventCreatedBy";

describe("EventCreatedBy", () => {
  it("doesn't display anything if there's no app / user", () => {
    render(<EventCreatedBy createdBy={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("displays a link to the app if app is passed", () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <EventCreatedBy createdBy={appAvatar} />
        </Wrapper>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(appAvatar.name);
    expect(link).toHaveProperty(
      "href",
      "http://localhost" + appPath(encodeURIComponent(appAvatar.id)),
    );
  });

  it("displays a link to the user settings if user is passed", () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <EventCreatedBy createdBy={staffMemberAvatar} />
        </Wrapper>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(staffMemberAvatar.firstName);
    expect(link).toHaveTextContent(staffMemberAvatar.lastName);
    expect(link).toHaveProperty(
      "href",
      "http://localhost" +
        staffMemberDetailsPath(encodeURIComponent(staffMemberAvatar.id)),
    );
  });
});
