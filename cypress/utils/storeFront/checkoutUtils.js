export function isShippingAvailableInCheckout(checkout, shippingName) {
  const shipping = checkout.availableShippingMethods.find(
    element => element.name === shippingName
  );
  return shipping !== undefined;
}
