import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { PermissionEnum } from "@dashboard/graphql";
import {
  AnnouncementImportanceEnum,
  AnnouncementsStaging,
  isStagingSchema,
} from "@dashboard/graphql/staging";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";

import { useAnnouncements } from "./useAnnouncements";

jest.mock("@dashboard/graphql/schemaVersion", () => ({
  isStagingSchema: jest.fn(),
  isMainSchema: jest.fn(),
}));

const setStagingSchema = (enabled: boolean) => {
  (isStagingSchema as jest.Mock).mockReturnValue(enabled);
};

// The dashboard's custom `useQuery` (makeQuery.ts) injects every PERMISSION_*
// flag (defaulting to false when there is no user) as a query variable, so the
// mock must match those exact variables.
const permissionVariables = Object.keys(PermissionEnum).reduce<Record<string, boolean>>(
  (acc, code) => ({ ...acc, [`PERMISSION_${code}`]: false }),
  {},
);

const announcementsMock: MockedResponse = {
  request: { query: AnnouncementsStaging, variables: permissionVariables },
  result: {
    data: {
      shop: {
        __typename: "Shop",
        announcements: [
          {
            __typename: "Announcement",
            title: "Maintenance",
            messageHtml: "<p>Down on Sunday</p>",
            importance: AnnouncementImportanceEnum.CRITICAL,
            type: "CUSTOM",
            createdAt: "2026-06-20T10:00:00Z",
            updatedAt: "2026-06-20T10:00:00Z",
            extra: {},
          },
        ],
      },
    },
  },
};

const createWrapper = (mocks: MockedResponse[]) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );

  Wrapper.displayName = "MockedWrapper";

  return Wrapper;
};

describe("useAnnouncements", () => {
  afterEach(() => {
    setStagingSchema(false);
  });

  it("fetches and maps announcements when the staging schema is active", async () => {
    // Arrange
    setStagingSchema(true);

    // Act
    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: createWrapper([announcementsMock]),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.announcements).toHaveLength(1);
    });
    expect(result.current.announcements[0].title).toBe("Maintenance");
    expect(result.current.announcements[0].importance).toBe(AnnouncementImportanceEnum.CRITICAL);
  });

  it("skips the query and returns an empty list on the main schema", async () => {
    // Arrange
    setStagingSchema(false);

    // Act
    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: createWrapper([]),
    });

    // Assert
    expect(result.current.announcements).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
