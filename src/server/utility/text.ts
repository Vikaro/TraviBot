export function remove(input : string, elements : Array<string>){
    let result = input;
    elements.forEach(element => {
        result = result.replace(element, '');
    });
    return result;
}

export function removeWhitespaces(input){
    return input.replace(/\s\s+/g, ' ').trim();
}