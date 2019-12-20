import { OrderStatus } from "@saleor/types/globalTypes";
import { getFilterVariables } from "./filters";

test("Get filter variables", () => {
  const filter = getFilterVariables({
    createdFrom: "2019-09-01",
    createdTo: "2019-09-10",
    email: "email@example.com",
    query: "24",
    status: [
      OrderStatus.FULFILLED.toString(),
      OrderStatus.PARTIALLY_FULFILLED.toString()
    ]
  });

  expect(filter).toMatchSnapshot();
});
