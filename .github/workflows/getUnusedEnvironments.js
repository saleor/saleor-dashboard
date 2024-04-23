module.exports = () => {
  const OPEN_PRS = JSON.parse(process.env.OPEN_PRS).map(function (v) {
    return v.toLowerCase();
  });
  const ENVIRONMENTS_FOR_PR_TESTING = JSON.parse(
    process.env.ENVIRONMENTS_FOR_PR_TESTING,
  );
  const prsToRemove = [];
  ENVIRONMENTS_FOR_PR_TESTING.forEach(environment => {
    if (!OPEN_PRS.includes(environment.name)) {
      prsToRemove.push(environment.key);
    }
  });
  return prsToRemove;
};