// @ts-strict-ignore
import { appAvatar } from "@dashboard/apps/fixtures";
import { AppPaths } from "@dashboard/apps/urls";
import { staffMemberAvatar } from "@dashboard/staff/fixtures";
import { staffMemberDetailsPath } from "@dashboard/staff/urls";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { EventCreatedBy } from "./EventCreatedBy";

describe("EventCreatedBy", () => {
  it("doesn't display anything if there's no app / user", () => {
    render(<EventCreatedBy createdBy={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("displays a link to the app if app is passed", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <MemoryRouter>
        <EventCreatedBy createdBy={appAvatar} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(appAvatar.name);
    expect(link).toHaveProperty(
      "href",
      "http://localhost" + AppPaths.resolveAppPath(encodeURIComponent(appAvatar.id)),
    );
  });
  it("displays a link to the user settings if user is passed", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <MemoryRouter>
        <EventCreatedBy createdBy={staffMemberAvatar} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(staffMemberAvatar.firstName);
    expect(link).toHaveTextContent(staffMemberAvatar.lastName);
    expect(link).toHaveProperty(
      "href",
      "http://localhost" + staffMemberDetailsPath(encodeURIComponent(staffMemberAvatar.id)),
    );
  });
});
