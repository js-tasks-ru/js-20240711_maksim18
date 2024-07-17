/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    `use strict`

    const arrayCopy = [...arr];

    const doAscendingComparison = (string1, string2) => string1.localeCompare(string2, undefined, {
        caseFirst: `upper`,
        sensitivity: `variant`
    });

    const doDescendingComparison = (string1, string2) => -doAscendingComparison(string1, string2);

    return param === `desc` ?  arrayCopy.sort(doDescendingComparison) : arrayCopy.sort(doAscendingComparison);
}
