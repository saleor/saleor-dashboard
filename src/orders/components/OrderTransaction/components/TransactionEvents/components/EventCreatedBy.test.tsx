import { appAvatarFixture } from "@dashboard/extensions/fixtures";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { staffMemberAvatar } from "@dashboard/staff/fixtures";
import { staffMemberDetailsPath } from "@dashboard/staff/urls";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { EventCreatedBy } from "./EventCreatedBy";

jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn(() => ({ enabled: true })),
}));

describe("EventCreatedBy", () => {
  it("doesn't display anything if there's no app / user", () => {
    render(<EventCreatedBy createdBy={null} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("displays a link to the app if app is passed", () => {
    render(
      <MemoryRouter>
        <EventCreatedBy createdBy={appAvatarFixture} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(appAvatarFixture.name as string);
    expect(link).toHaveProperty(
      "href",
      "http://localhost" +
        ExtensionsUrls.resolveViewManifestExtensionUrl(appAvatarFixture.id).replace("?", ""),
    );
  });
  it("displays a link to the user settings if user is passed", () => {
    render(
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
