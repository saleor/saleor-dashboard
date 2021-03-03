class Utils {
  getValueWithDefault(condition, value, defaultValue = "") {
    return condition ? value : defaultValue;
  }
}
export default Utils;
