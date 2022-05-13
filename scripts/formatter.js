exports.format = function(msgs) {
  const results = {};
  for (const [id, msg] of Object.entries(msgs)) {
    results[id] = {
      context: msg.description,
      string: msg.defaultMessage
    };
  }
  return results;
};
