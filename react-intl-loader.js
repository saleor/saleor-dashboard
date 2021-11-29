"use strict";
exports.__esModule = true;
var murmur = require("murmurhash3js");
var getHashDigest = function (message) { return "".concat(murmur.x86.hash32(message)); };
var searchStringInArray = function (str, strArray) {
    var result = [];
    for (var j in strArray) {
        if (strArray[j].match(str))
            result.push(j);
    }
    return result;
};
var getId = function (content) {
    var defaultMessageRegExp = new RegExp(/defaultMessage\s?[:|=]\s?[\s\S]?\s*?["|'|`](.*)["|'|`]/);
    var defaultMessage = defaultMessageRegExp.test(content) ? content.match(defaultMessageRegExp)[0] : null;
    var descriptionRegExp = new RegExp(/description\s?[:|=]\s?[\s\S]?\s*?["|'|`](.*)["|'|`]/);
    var description = descriptionRegExp.test(content) ? content.match(descriptionRegExp)[0] : null;
    return getHashDigest(description ? "".concat(defaultMessage, "#").concat(description) : defaultMessage);
};
module.exports = function (source) {
    var searchRegExp = new RegExp(/defaultMessage/);
    if (searchRegExp.test(source)) {
        var sourceArray_1 = source.split("\n");
        var positions = searchStringInArray(searchRegExp, sourceArray_1);
        positions.reverse().map(function (position) {
            var line = sourceArray_1[position];
            var objRegex = new RegExp('defaultMessage:');
            var isObject = objRegex.test(line);
            var indent = line.match(/^\s+/)[0];
            // one line object
            var oneLinerObjectRegExp = new RegExp("{ defaultMessage: .* }");
            if (oneLinerObjectRegExp.test(line)) {
                var id_1 = getId(line);
                var _a = line.split("defaultMessage:"), first = _a[0], last = _a[1];
                var newRow_1 = "".concat(first, "id: \"").concat(id_1, "\", defaultMessage:").concat(last);
                sourceArray_1.splice(position, 1, newRow_1);
                return position;
            }
            // multi line object
            if (isObject) {
                var exContent_1 = sourceArray_1.slice(position - 2, position + 3).join("\n");
                var id_2 = getId(exContent_1);
                var newRow_2 = "".concat(indent, "id: \"").concat(id_2, "\",");
                sourceArray_1.splice(position, 0, newRow_2);
                return position;
            }
            // one line component
            var oneLinerComponentRegExp = new RegExp("<FormattedMessage .* />");
            if (oneLinerComponentRegExp.test(line)) {
                var id_3 = getId(line);
                var _b = line.split("<FormattedMessage"), firstLine = _b[0], lastLine = _b[1];
                var row1 = "".concat(firstLine, "<FormattedMessage");
                var row2 = "".concat(indent, "  id=\"").concat(id_3, "\"");
                var row3 = "".concat(indent, " ").concat(lastLine);
                sourceArray_1.splice(position, 1, row1, row2, row3);
                return position;
            }
            // multi line component
            var exContent = sourceArray_1.slice(position - 2, position + 3).join("\n");
            var id = getId(exContent);
            var newRow = "".concat(indent, "id=\"").concat(id, "\"");
            sourceArray_1.splice(position, 0, newRow);
            return position;
        });
        return this.callback(null, sourceArray_1.join("\n"));
    }
    return this.callback(null, source);
};
