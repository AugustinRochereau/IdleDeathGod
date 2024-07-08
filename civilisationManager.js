const prefixes = ["Aeg", "Zy", "Quin", "Ar", "Sol", "Nor", "Ven", "Mi", "Zu", "Ma"];

const infixes = ["chi", "lan", "dri", "dor", "ma","mor", "rin", "thol", "di"];

const suffixes = ["nian", "an", "sol", "ni", "on", "um", "ar", "ia"];

function getRandomElement(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateCivName(){
    const prefix = getRandomElement(prefixes);
    const infix = getRandomElement(infixes);
    const suffix = getRandomElement(suffixes);

    const name = `${prefix}${infix}${suffix}`;

    return name;
}