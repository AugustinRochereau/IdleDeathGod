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

// Civilisation Perks
function civilisationPerk(name, type, id, isactive, description, buyfunction){
    this.name = name; 
    this.type = type; // Integer representing type of upgrade
    this.id = id;
    this.isactive = isactive;
    this.description = description
    this.buyfunction = buyfunction;
}

civPerks = {
    "perk-eternal-humans": new civilisationPerk("Underground Pact", 0, "perk-eternal-humans", false,
    "Gain 1% of your maximum population as Eternal Humans from now until you reset.",
    function(){
        gV.eternalHumans = Math.floor(gV.maxPopulation / 100);
    }),
}

function getCivPerk(){
    return civPerks["perk-eternal-humans"];
}

function buyCivPerk(perkId) {
    console.log('attempting to buy ' + perkId);
    perk = civPerks[perkId];
    if (!perk.isactive){
        perk.isactive = true;
        perk.buyfunction();
    }

    hideCivilisationPerks();
}

function perkColor(type){
    switch (type){
        case 0:
            return 'white';
        case 1:
            return 'black';
        default:
            return 'white';
    }
}

function perkTextColor(type){
    switch (type){
        case 0:
            return 'black';
        case 1:
            return 'white';
        default:
            return 'black';
    }    
}

function displayCivPerk() {
    // Card 1
    perk1 = getCivPerk();
    card1 = document.getElementById('card1');
    card1.innerHTML = "<h3>" + perk1.name + "</h3>" +
                        "<p>" + perk1.description + "</p>" + 
                        "<button class='choosePerkButton' data-perkid='" + perk1.id + "' onclick='buyCivPerk(this.getAttribute(\"data-perkid\"))'>Choose</button>";                 
    card1.style.backgroundColor = perkColor(perk1.type);
    card1.style.color = perkTextColor(perk1.type);
}