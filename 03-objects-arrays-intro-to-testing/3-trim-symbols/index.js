/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === undefined) {
        return string;
    }

    if (string === `` || size === 0) {
        return ``;
    }

    let resultString = ``;
    let counter = 0;
    let previousChar = ``;

    for (const char of string) {
        if (char !== previousChar) {
            previousChar = char;
            counter = 0;
        }

        if (counter < size && char === previousChar) {
            resultString += char;
            counter++;
        }
    }

    return resultString;
}
