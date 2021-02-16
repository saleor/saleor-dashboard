class Promises {
  createPromise(requestFunction) {
    return new Promise(resolve => {
      requestFunction
        .then(resp => resp.body.data)
        .then(result => resolve(result));
    });
  }
}
export default Promises;
