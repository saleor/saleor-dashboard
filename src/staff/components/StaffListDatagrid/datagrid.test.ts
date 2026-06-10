import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor } from "@dashboard/misc";
import { type StaffMember } from "@dashboard/staff/types";
import { type GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import { type DefaultTheme } from "@saleor/macaw-ui-next";
import { testIntlInstance } from "@test/intl";

import { createGetCellContent } from "./datagrid";
import { columnsMessages } from "./messages";

const currentTheme: DefaultTheme = "defaultLight";
const customerColumn: AvailableColumn = {
  id: "customer",
  title: "Customer",
  width: 160,
};

const createStaffMember = (orderIds: string[]): StaffMember => ({
  __typename: "User",
  id: "VXNlcjoyMQ==",
  email: "admin@example.com",
  firstName: "Chris",
  isActive: true,
  lastName: "Cooper",
  avatar: null,
  orders: {
    __typename: "OrderCountableConnection",
    edges: orderIds.map(id => ({
      __typename: "OrderCountableEdge",
      node: {
        __typename: "Order",
        id,
      },
    })),
  },
});

const createCustomerCell = (staffMember: StaffMember): GridCell => {
  const getCellContent = createGetCellContent({
    staffMembers: [staffMember],
    columns: [customerColumn],
    intl: testIntlInstance,
    currentTheme,
  });

  return getCellContent([0, 0]);
};

describe("createGetCellContent", () => {
  it("returns placeholder for staff members without orders", () => {
    // Arrange
    const staffMember = createStaffMember([]);

    // Act
    const cell = createCustomerCell(staffMember);

    // Assert
    expect(cell).toEqual({
      allowOverlay: false,
      cursor: "pointer",
      data: PLACEHOLDER,
      displayData: PLACEHOLDER,
      kind: GridCellKind.Text,
      readonly: true,
      style: "normal",
    });
  });

  it("returns customer tag for staff members with orders", () => {
    // Arrange
    const staffMember = createStaffMember(["T3JkZXI6MQ=="]);
    const label = testIntlInstance.formatMessage(columnsMessages.customer);

    // Act
    const cell = createCustomerCell(staffMember);

    // Assert
    expect(cell).toEqual({
      allowOverlay: false,
      copyData: label,
      cursor: "pointer",
      data: {
        kind: "tags-cell",
        possibleTags: [
          {
            color: getStatusColor({ status: "info", currentTheme }).base,
            tag: label,
          },
        ],
        tags: [label],
      },
      kind: GridCellKind.Custom,
      readonly: true,
    });
  });
});
