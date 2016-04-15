/* Various for small tasks
 */

// Return true if a variable is a String object or a string literal
export function isString(str) {
    return typeof(str) == 'string' || str instanceof String;
}
