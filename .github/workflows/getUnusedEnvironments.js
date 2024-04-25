module.exports = () => {
  const openPullRequests = JSON.parse(process.env.OPEN_PRS);
  console.log(openPullRequestsInString);
  const OPEN_PRS = openPullRequests.map(function (v) {
    return v.toLowerCase();
  });
  const ENVIRONMENTS_FOR_PR_TESTING = JSON.parse(JSON.parse(
    process.env.ENVIRONMENTS_FOR_PR_TESTING,
  ));
  const prsToRemove = [];
  ENVIRONMENTS_FOR_PR_TESTING.forEach(environment => {
    if (!OPEN_PRS.includes(environment.name)) {
      prsToRemove.push(environment.key);
    }
  });
  return prsToRemove;
};