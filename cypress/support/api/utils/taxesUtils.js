import {
  getTaxClassList,
  getTaxConfigurationList,
  updateTaxes,
} from "../requests/Taxes";

export function updateTaxConfigurationForChannel({
  channelSlug = "default-channel",
  chargeTaxes = true,
  taxCalculationStrategy = "FLAT_RATES",
  pricesEnteredWithTax = "false",
}) {
  getTaxConfigurationList().then(taxConfigurationList => {
    const taxConfigurationForChannel = taxConfigurationList.find(
      taxConfiguration => taxConfiguration.node.channel.slug === channelSlug,
    );
    updateTaxes({
      id: taxConfigurationForChannel.node.id,
      chargeTaxes,
      taxCalculationStrategy,
      pricesEnteredWithTax,
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
