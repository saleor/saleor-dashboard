export function expectCorrectDataInAttribute(
  attribute,
  {
    attributeName,
    attributeType,
    entityType = null,
    unit = null,
    valueRequired = true,
  },
) {
  expect(attribute.name).to.eq(attributeName);
  expect(attribute.slug).to.eq(attributeName);
  expect(attribute.inputType).to.eq(attributeType);
  expect(attribute.entityType).to.eq(entityType);
  expect(attribute.unit).to.eq(unit);
  expect(attribute.valueRequired).to.eq(valueRequired);
}
