/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const arrayCopy = [...arr];

    const sortingDirection = param === `desc`? -1: 1;

    const doSorting = (string1, string2) => sortingDirection * string1.localeCompare(string2, `ru`, {
        caseFirst: `upper`,
        sensitivity: `variant`
    });

    return arrayCopy.sort(doSorting);
}
