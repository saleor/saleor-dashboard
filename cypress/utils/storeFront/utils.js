export const isVisible = ({
  request,
  respObjectKey,
  responseValueKey,
  value = true
}) =>
  request.then(resp => {
    resp = resp.body.data;
    respObjectKey.forEach(element => {
      resp = resp[element];
    });
    if (resp === null) {
      return false;
    }
    if ("totalCount" in resp && resp.totalCount === 0) {
      return false;
    }
    let respValue = resp;
    responseValueKey.forEach(element => {
      respValue = respValue[element];
    });
    return respValue === value;
  });
