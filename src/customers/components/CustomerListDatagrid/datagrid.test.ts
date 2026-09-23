import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Customer } from "@dashboard/customers/types";
import { type GridCell } from "@glideapps/glide-data-grid";

import { createGetCellContent } from "./datagrid";

const columns: AvailableColumn[] = [
  { id: "companyName", title: "Company name", width: 250 },
  { id: "externalReference", title: "External reference", width: 250 },
];

const createCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  __typename: "User",
  id: "VXNlcjoyMQ==",
  email: "customer@example.com",
  firstName: "Chris",
  lastName: "Cooper",
  externalReference: "ext-1",
  defaultBillingAddress: {
    __typename: "Address",
    id: "QWRkcmVzczox",
    companyName: "Acme Inc.",
  },
  ...overrides,
});

const getCell = (customer: Customer, column: number): GridCell =>
  createGetCellContent({ customers: [customer], columns })([column, 0]);

describe("createGetCellContent", () => {
  it("renders billing company name and external reference", () => {
    // Arrange
    const customer = createCustomer();

    // Act
    const companyCell = getCell(customer, 0);
    const referenceCell = getCell(customer, 1);

    // Assert
    expect(companyCell).toMatchObject({ data: "Acme Inc." });
    expect(referenceCell).toMatchObject({ data: "ext-1" });
  });

  it("renders empty cells when the customer has no billing address or reference", () => {
    // Arrange
    const customer = createCustomer({ defaultBillingAddress: null, externalReference: null });

    // Act
    const companyCell = getCell(customer, 0);
    const referenceCell = getCell(customer, 1);

    // Assert
    expect(companyCell).toMatchObject({ data: "" });
    expect(referenceCell).toMatchObject({ data: "" });
  });
});
