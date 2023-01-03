import { getTaxConfigurationList, updateTaxes } from "../requests/Texes";

export function updateTaxConfigurationForChannel({channelSlug, chargeTaxes= true, taxCalculationStrategy = "FLAT_RATES"}){
  getTaxConfigurationList()
  .then(taxConfigurationList => {
    const taxConfigurationForChannel = taxConfigurationList.find(taxConfiguration => {
      return taxConfiguration.node.channel.slug == channelSlug
    })
    updateTaxes({id: taxConfigurationForChannel.node.id, chargeTaxes, taxCalculationStrategy})
  })
}