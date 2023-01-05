import {
  getTaxClassList,
  getTaxConfigurationList,
  updateTaxes,
} from "../requests/Taxes";

export function updateTaxConfigurationForChannel({
  channelSlug,
  chargeTaxes = true,
  taxCalculationStrategy = "FLAT_RATES",
}) {
  getTaxConfigurationList().then(taxConfigurationList => {
    const taxConfigurationForChannel = taxConfigurationList.find(
      taxConfiguration => taxConfiguration.node.channel.slug === channelSlug,
    );
    updateTaxes({
      id: taxConfigurationForChannel.node.id,
      chargeTaxes,
      taxCalculationStrategy,
    });
  });
}

export function getDefaultTaxClass() {
  getTaxClassList().then(taxClassArray => {
    const taxClass = taxClassArray.find(
      taxClassItem => taxClassItem.node.name === "No Taxes",
    );
    return taxClass.node;
  });
}
