export const def = function(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value,
        enumerable,
        configurable: true,
        writable: true
    })
}