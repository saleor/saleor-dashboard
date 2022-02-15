export function isShippingAvailableInCheckout(checkout, shippingName) {
  const shipping = checkout.shippingMethods.find(
    element => element.name === shippingName
  );
  return shipping !== undefined;
}
