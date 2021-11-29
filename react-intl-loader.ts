import murmur = require('murmurhash3js');

const getHashDigest = (message: string):string => `${murmur.x86.hash32(message)}`

const searchStringInArray = function (str: RegExp, strArray: string[]): number[] {
  let result = []
  for (const j in strArray) {
      if (strArray[j].match(str)) result.push(j);
  }
  return result;
}

const getId = (content: string): string => {
  const defaultMessageRegExp = new RegExp(/defaultMessage\s?[:|=]\s?[\s\S]?\s*?["|'|`](.*)["|'|`]/)
  const defaultMessage = defaultMessageRegExp.test(content) ? content.match(defaultMessageRegExp)[0] : null

  const descriptionRegExp = new RegExp(/description\s?[:|=]\s?[\s\S]?\s*?["|'|`](.*)["|'|`]/)
  const description = descriptionRegExp.test(content) ? content.match(descriptionRegExp)[0] : null;

  return getHashDigest(description? `${defaultMessage}#${description}`: defaultMessage)
}

module.exports = function(source: string) {
  const searchRegExp = new RegExp(/defaultMessage/)
  if (searchRegExp.test(source)) {
    const sourceArray = source.split("\n")
    const positions = searchStringInArray(searchRegExp, sourceArray)

    positions.reverse().map(position => {
      const line = sourceArray[position]
      const objRegex = new RegExp('defaultMessage:')
      const isObject = objRegex.test(line)
      const indent = line.match(/^\s+/)[0]

      // one line object
      const oneLinerObjectRegExp = new RegExp(`\{ defaultMessage: .* \}`)
      if (oneLinerObjectRegExp.test(line)) {
        const id = getId(line);
        const [first, last] = line.split("defaultMessage:")
        const newRow = `${first}id: "${id}", defaultMessage:${last}`
        sourceArray.splice(position, 1, newRow)

        return position
      }

      // multi line object
      if (isObject) {
        const exContent = sourceArray.slice(position-2, position+3).join("\n")
        const id = getId(exContent)
        const newRow = `${indent}id: "${id}",`
        sourceArray.splice(position, 0, newRow)

        return position
      }

      // one line component
      const oneLinerComponentRegExp = new RegExp(`<FormattedMessage .* />`)
      if (oneLinerComponentRegExp.test(line)) {
        const id = getId(line);
        const [firstLine, lastLine] = line.split("<FormattedMessage")
        const row1 = `${firstLine}<FormattedMessage`
        const row2 = `${indent}  id="${id}"`
        const row3 = `${indent} ${lastLine}`
        sourceArray.splice(position, 1, row1, row2, row3)

        return position
      }

      // multi line component
      const exContent = sourceArray.slice(position-2, position+3).join("\n")
      const id = getId(exContent)
      const newRow = `${indent}id="${id}"`
      sourceArray.splice(position, 0, newRow)

      return position
    })

    return this.callback(null, sourceArray.join("\n"))
  }

  return this.callback(null, source)
}