const { softExpect } = chai;

export function expectCorrectDataInAttribute(
  attribute,
  {
    attributeName,
    attributeType,
    entityType = null,
    unit = null,
    valueRequired = true
  }
) {
  softExpect(attribute.name).to.eq(attributeName);
  softExpect(attribute.slug).to.eq(attributeName);
  softExpect(attribute.inputType).to.eq(attributeType);
  softExpect(attribute.entityType).to.eq(entityType);
  softExpect(attribute.unit).to.eq(unit);
  softExpect(attribute.valueRequired).to.eq(valueRequired);
}
