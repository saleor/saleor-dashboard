import { useOrderDraftBulkCancelMutation } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { useBulkDeletion } from "./useBulkDeletion";

jest.mock("react-intl");
jest.mock("@dashboard/graphql", () => ({
  useOrderDraftBulkCancelMutation: jest.fn(() => [jest.fn(), {}]),
}));
describe("Order draft list useBulkDeletion", () => {
  it("deletes order drafts for by given ids", async () => {
    // Arrange
    const onComplete = jest.fn();
    const selectedRowIds = ["id1", "id2"];
    const orderDraftBulkDelete = jest.fn();
    const useOrderDraftBulkCancelMutationMock = useOrderDraftBulkCancelMutation as jest.Mock;
    useOrderDraftBulkCancelMutationMock.mockReturnValue([orderDraftBulkDelete, {}]);

    // Act
    const { result } = renderHook(() => useBulkDeletion(onComplete));
    await result.current.onOrderDraftBulkDelete(selectedRowIds);
    // Assert
    expect(orderDraftBulkDelete).toBeCalledWith({
      variables: {
        ids: ["id1", "id2"],
      },
    });
  });
});
