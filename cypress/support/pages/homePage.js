import { HEADER_SELECTORS } from "../../elements/header/header-selectors";
import { HOMEPAGE_SELECTORS } from "../../elements/homePage/homePage-selectors";

export function changeChannel(channelName) {
  cy.get(HEADER_SELECTORS.channelSelect)
    .click()
    .addAliasToGraphRequest("Home")
    .get(HEADER_SELECTORS.channelSelectList)
    .contains(channelName)
    .click()
    .wait("@Home");
}

export function expectWelcomeMessageIncludes(name) {
  cy.get(HOMEPAGE_SELECTORS.welcomeMessage)
    .invoke("text")
    .then(text => {
      expect(text, `welcome message should contains ${name}`).to.contains(name);
    });
}

export function getOrdersReadyToFulfillRegex(
  ordersReadyToFulfillBefore,
  quantityOfNewOrders
) {
  const allOrdersReadyToFulfill =
    ordersReadyToFulfillBefore + quantityOfNewOrders;
  const notANumberRegex = "\\D*";
  return new RegExp(
    `${notANumberRegex}${allOrdersReadyToFulfill}${notANumberRegex}`
  );
}

export function getOrdersReadyForCaptureRegex(
  ordersReadyForCaptureBefore,
  quantityOfNewOrders
) {
  const allOrdersReadyForCapture =
    ordersReadyForCaptureBefore + quantityOfNewOrders;
  const notANumberRegex = "\\D*";
  return new RegExp(
    `${notANumberRegex}${allOrdersReadyForCapture}${notANumberRegex}`
  );
}

export function getProductsOutOfStockRegex(
  productsOutOfStockBefore,
  quantityOfNewProducts
) {
  const allProductsOutOfStock =
    productsOutOfStockBefore + quantityOfNewProducts;
  const notANumberRegex = "\\D*";
  return new RegExp(
    `${notANumberRegex}${allProductsOutOfStock}${notANumberRegex}`
  );
}

export function getSalesAmountRegex(salesAmountBefore, addedAmount) {
  const totalAmount = salesAmountBefore + addedAmount;
  const totalAmountString = totalAmount.toFixed(2);
  const totalAmountIntegerValue = totalAmountString.split(".")[0];
  const totalAmountDecimalValue = totalAmountString.split(".")[1];
  const decimalSeparator = "[,.]";
  const totalAmountIntegerWithThousandsSeparator = new Intl.NumberFormat("en")
    .format(totalAmountIntegerValue)
    .replaceAll(",", "[,.]*");
  const totalAmountWithSeparators = `${totalAmountIntegerWithThousandsSeparator}${decimalSeparator}${totalAmountDecimalValue}`;
  const notANumberRegex = "\\D*";
  return new RegExp(
    `${notANumberRegex}${totalAmountWithSeparators}${notANumberRegex}`
  );
}

export function getTodaysOrdersRegex(ordersBefore, quantityOfNewOrders) {
  const allOrders = ordersBefore + quantityOfNewOrders;
  const notANumberRegex = "\\D*";
  return new RegExp(`${notANumberRegex}${allOrders}${notANumberRegex}`);
}
