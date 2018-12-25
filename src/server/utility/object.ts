
export function objectFilterKey(obj, predicate) {
    return Object.keys(obj)
        .filter(key => predicate(obj))
        .reduce((res, key) => (res[key] = obj[key], res), {})
}