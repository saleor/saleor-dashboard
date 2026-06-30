import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  AnnouncementImportanceEnum,
  AnnouncementsDocument,
  PermissionEnum,
} from "@dashboard/graphql";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";

import { useAnnouncements } from "./useAnnouncements";

// The dashboard's custom `useQuery` (makeQuery.ts) injects every PERMISSION_*
// flag (defaulting to false when there is no user) as a query variable, so the
// mock must match those exact variables.
const permissionVariables = Object.keys(PermissionEnum).reduce<Record<string, boolean>>(
  (acc, code) => ({ ...acc, [`PERMISSION_${code}`]: false }),
  {},
);

const announcementsMock: MockedResponse = {
  request: { query: AnnouncementsDocument, variables: permissionVariables },
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

const announcementsErrorMock: MockedResponse = {
  request: { query: AnnouncementsDocument, variables: permissionVariables },
  error: new Error("Network error"),
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
  it("fetches and maps announcements", async () => {
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

  it("fails silently to an empty list on error", async () => {
    // Act
    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: createWrapper([announcementsErrorMock]),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.announcements).toEqual([]);
  });
});
