const filterPostalCodes = (postalCodes, codeToFilterOut) =>
  postalCodes.filter(
    rule =>
      rule.start !== codeToFilterOut.start && rule.end !== codeToFilterOut.end
  );

export default filterPostalCodes;
