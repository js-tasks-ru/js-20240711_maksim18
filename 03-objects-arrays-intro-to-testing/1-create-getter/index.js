/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const pathParts = (path ?? '').split(`.`);

    const getter = function (obj) {
        obj ??= {};

        for (const pathPart of pathParts) {
            if (!Object.hasOwnProperty.call(obj, pathPart)) {
                return undefined;
            }

            if (!obj[pathPart]) {
                return obj[pathPart] === null ? null : undefined;
            }

            obj = obj[pathPart];
        }

        return obj;
    }

    return getter;
}
