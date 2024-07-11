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
        TextBox.addText("Eternal humans can survive the worst apocalypse. The thing is, they do not die. So they won't give you souls." + 
        " But fortunately, they can make perfectly mortal babies. Granting eternal life to one does not make it hereditary." +
        " Just imagine if it was the case. Then you would not have any souls. So boring.");
    }),
    "perk-occult-vessels": new civilisationPerk("Wealthy vessels", 1, "perk-occult-vessels", false,
    "Improve soul vessels effectiveness by 4.",
    function() {
        gV.soulVesselMultiplier *= 4;
        TextBox.addText("It is now a custody to put belongings with the dead. Why would humans do that ?" +
                        " I mean, it still gives you more souls, so no complaining here.");
    }),
    "perk-mythic-heroes": new civilisationPerk("Mythic heroes", 1, "perk-mythic-heroes", false,
    "Multiplier to souls gained based on death rate. World tendancy minimum life expectancy -10"),
    function() {
        gV.worldTendancyMinLifeExpectancy -= 10;
        gV.deathRateMultiplierCondition = 1;
        TextBox.addText("In times of war, great heroes emerge and stand ground on small bridges against hordes of enemies." + 
                        " The more they fight, the more souls you gain.")
    }
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
                        "<button class='choosePerkButton' data-perkid='" + perk1.id + 
                        "' onclick='buyCivPerk(this.getAttribute(\"data-perkid\"))'>Choose</button>";                 
    card1.style.backgroundColor = perkColor(perk1.type);
    card1.style.color = perkTextColor(perk1.type);

    // Card 2
    perk2 = civPerks["perk-occult-vessels"];
    card2 = document.getElementById('card2');
    card2.innerHTML = "<h3>" + perk2.name + "</h3>" +
                        "<p>" + perk2.description + "</p>" + 
                        "<button class='choosePerkButton' data-perkid='" + perk2.id + 
                        "' onclick='buyCivPerk(this.getAttribute(\"data-perkid\"))'>Choose</button>";   
    card2.style.backgroundColor = perkColor(perk2.type);
    card2.style.color = perkTextColor(perk2.type);   
    
    // Card 3
    perk3 = civPerks["perk-mythic-heroes"];
    card3 = document.getElementById('card3');
    card3.innerHTML = "<h3>" + perk3.name + "</h3>" +
                        "<p>" + perk3.description + "</p>" + 
                        "<button class='choosePerkButton' data-perkid='" + perk3.id + 
                        "' onclick='buyCivPerk(this.getAttribute(\"data-perkid\"))'>Choose</button>";   
    card3.style.backgroundColor = perkColor(perk3.type);
    card3.style.color = perkTextColor(perk3.type);  
}