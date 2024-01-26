import {
  TaxCalculationStrategy,
  TaxConfigurationFragment,
} from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";

const flatTaxRateChoice = {
  label: "Flat rate",
  value: TaxCalculationStrategy.FLAT_RATES,
};

const isStrategyFlatRates = (strategy: string) =>
  strategy === TaxCalculationStrategy.FLAT_RATES;

export const useTaxStrategyChoices = () => {
  const shop = useShop();
  const taxAppsChoices =
    shop?.availableTaxApps.map(app => ({
      value: app.id,
      label: app.name,
    })) ?? [];

  return [...taxAppsChoices, flatTaxRateChoice];
};

export const getTaxCalculationStrategy = (taxCalculationStrategy: string) =>
  isStrategyFlatRates(taxCalculationStrategy)
    ? TaxCalculationStrategy.FLAT_RATES
    : TaxCalculationStrategy.TAX_APP;

export const getTaxAppId = (taxCalculationStrategy: string) =>
  isStrategyFlatRates(taxCalculationStrategy) ? null : taxCalculationStrategy;

export const getSelectedTaxStrategy = (
  currentTaxConfiguration: TaxConfigurationFragment,
) =>
  isStrategyFlatRates(currentTaxConfiguration?.taxCalculationStrategy)
    ? TaxCalculationStrategy.FLAT_RATES
    : currentTaxConfiguration?.taxAppId;

// const taxStrategyChoices = [
//   ...mockedTaxStrategyChoices.map(choice => ({
//     label: (
//       <Box
//         gap={4}
//         alignItems="center"
//         display="grid"
//         __gridTemplateColumns="1fr auto"
//         width="100%"
//       >
//         <Box display="flex" alignItems="center" gap={3}>
//           <AppAvatar
//             logo={
//               choice.brand?.logo?.default
//                 ? { source: choice.brand?.logo?.default }
//                 : undefined
//             }
//             // @ts-expect-error: TODO: Remove when tax strategy is implemented
//             size={5}
//           />
//           <Box>
//             <Box display="flex" alignItems="center" gap={1}>
//               <Text>Use app:</Text>
//               <Text variant="bodyStrong">{choice.name}</Text>
//               {choice.version && (
//                 <Text variant="body" color="default2">
//                   {`v${choice.version}`}
//                 </Text>
//               )}
//             </Box>
//             <Text variant="caption" color="default2">
//               Created at: {moment(choice.created).format("YYYY-MM-DD HH:mm")}
//             </Text>
//           </Box>
//         </Box>
//         <Box
//           as="a"
//           href={AppUrls.resolveAppDetailsUrl(choice.id)}
//           target="_blank"
//           textDecoration="underline"
//           display="flex"
//           alignItems="center"
//           gap={1}
//         >
//           <Text
//             color="default2"
//             variant="caption"
//             ellipsis
//             __maxWidth="150px"
//           >
//             {choice.identifier}
//           </Text>
//           <ExternalLinkIcon size="small" color="default2" />
//         </Box>
//       </Box>
//     ),
//     value: choice.id,
//   })),
//   {
//     label: (
//       <Box __height={40} display="flex" alignItems="center">
//         <Text>Use flat rates</Text>
//       </Box>
//     ),
//     value: TaxCalculationStrategy.FLAT_RATES,
//   },
// ];
