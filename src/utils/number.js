function parse(value) {
    if (typeof value === "number") {
        return value;
    }
    
    if (typeof value === "string") {
        return Number(value.replace(".", "").replace(",", "."));
    }

    throw Error('Value isn\'t a String');
}

function format(number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(number);
}

module.exports = {
    parse,
    format,
}