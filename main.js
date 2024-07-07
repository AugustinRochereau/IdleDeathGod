let livingHumans = 2;
let growthRate = 0.1;
let maxLivingHumans = 100;
let growthSlowdown = 2; // exponent 
let deathRate = 0;
let deadSouls = 0;
let mortalRealmNumber = 1;
let lifeExpectancy = 20;
let years = 0;
let tickspeed = 1;
let soulPoints = 0;
let maxGrowthAffect = 0.1;
let soulPointMultiplier = 1;

let lastUpdateTime = 0;
const updatesPerSecond = 60;
const timePerUpdate = 1000 / updatesPerSecond;

upgradeCosts = {
    "diseaseButton": 1000,
    "tickspeedUpgrade": 100,
    "soulVessels": 1000,
}

upgradeNumbers = {
    "tickspeedUpgrade": 0,
    "soulVessels": 0,
}

function updatePopulation() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTime;

    let randomGrowthAffect = (Math.random() * 2 - 1) * maxGrowthAffect;

    if (deltaTime >= timePerUpdate) {

        deathRate = 1 / (lifeExpectancy);

        let growth = (soulPoints + 1) * growthRate * livingHumans * (1 - livingHumans / Math.max(maxLivingHumans, livingHumans + 20)) ** growthSlowdown * deltaTime * tickspeed / 1000;
        let deaths = deathRate * livingHumans * deltaTime * tickspeed / 1000;
        livingHumans += growth * (1 + randomGrowthAffect) - deaths;
        deadSouls += (upgradeNumbers["soulVessels"] + 1) * deaths;
        lastUpdateTime = currentTime;
        years += deltaTime * tickspeed / 1000;
    }
    if (Math.floor(livingHumans) <= 0){
        checkAchievement1();
        nextMortalRealm();
    } else if (Math.floor(livingHumans) >= maxLivingHumans){
        checkAchievement2();
    }
    displayCounters();
    statisticsDisplay();
}

function nextMortalRealm() {
    displayMortalRealmResetScreen();
}

function displayMortalRealmResetScreen(){
    const screen = document.getElementById("mortalRealmReset");
    const text = document.getElementById("mortalRealmResetText");
    screen.style.display = "block";
    let soulPointsGain = (Math.max(0, Math.log10(deadSouls) * soulPointMultiplier - soulPoints));
    text.innerHTML = "<span style='font-size: 25px;'>You are entering mortal realm " + numberFormat(mortalRealmNumber) + ".</span><br>" + 
                        "<span class='godText'>You led the humans for " + floatNumberFormat(years) + " years.<br>" +
                        "For the souls you've watched over, I'll give you " + floatNumberFormat(soulPointsGain) + 
                        " soul points.</span><br>Click anywhere to continue...";

    screen.addEventListener("click", hideMortalRealmResetScreen);

    soulPoints += soulPointsGain;
    mortalRealmNumber += 1;
    resetToDefaultValues();
    displayCounters();
}

function resetToDefaultValues() {
    livingHumans = 2;
    growthRate = 0.1;
    maxLivingHumans = 100;
    growthSlowdown = 2; // exponent 
    deathRate = 0;
    deadSouls = 0;
    lifeExpectancy = 20;
    years = 0;
    tickspeed = 1;

    upgradeCosts = {
        "diseaseButton": 1000,
        "tickspeedUpgrade": 100,
        "soulVessels": 1000,
    }
    
    upgradeNumbers = {
        "tickspeedUpgrade": 0,
        "soulVessels": 0,
    } 

    document.getElementById("tickspeedUpgrade").innerHTML = "Buy Tickspeed<br>Cost: 100 souls";
    document.getElementById("soulVessels").style.display = "none";
    document.getElementById("worldTendancy").style.display = "none";

    technologies = {
        "tech-fire": new techUpgrade("Fire", 50, false, true),
        "tech-tools1": new techUpgrade("Tools 1", 100, false, false),
        "tech-crops": new techUpgrade("Crops", 500, false, false),
        "tech-huts": new techUpgrade("Huts", 200, false, false),
        "tech-speech": new techUpgrade("Speech", 1000, false, false),
        "tech-unlock-soul-vessels": new techUpgrade("Unlock Soul Vessels", 2000, false, false),
        "tech-unlock-world-tendancy": new techUpgrade("World Tendancy", 5000, false, false),
    }

    updateTechButtonsDisplay();
}

function hideMortalRealmResetScreen(){
    document.getElementById("mortalRealmReset").style.display = "none";
}

function buySoulVessel(){
    const soulVesselsButton = document.getElementById("soulVessels");
    if (deadSouls >= upgradeCosts["soulVessels"]){
        deadSouls = 0;
        upgradeNumbers["soulVessels"] += 1;
        upgradeCosts["soulVessels"] *= 1.5;
    }
    soulVesselsButton.innerHTML = "Next Soul Vessel: " + numberFormat(upgradeCosts["soulVessels"]) +" souls" + 
                        '<span class="upgradeDescription" style="font-size: 10px;">Reset souls for a boost to soul gains</span>'
}

function displayCounters() {
    hCounter = Math.floor(livingHumans);
    sCounter = Math.floor(deadSouls);

    document.getElementById('living-humans').innerHTML = `Living Humans:<br> <b>${numberFormat(hCounter)}</b>`;
    document.getElementById('dead-souls').innerHTML = `Souls:<br> <b>${numberFormat(sCounter)}</b>`;
}

function numberFormat(n){
    if (n < 10000){
        return n
    } else {
        return n.toExponential(2)
    }
}

function floatNumberFormat(x) {
    if (x < 10000){
        return x.toFixed(2)
    } else {
        return x.toExponential(2)
    }   
}

function statisticsDisplay() {
    document.getElementById("statisticsDisplay").innerHTML = 'You are in mortal realm number ' + 
                        mortalRealmNumber + '.<br><span style="font-size: 12px;">It is year '+ Math.floor(years) + 
                        ', tickspeed is ' + floatNumberFormat(tickspeed) +'<br>Human life expectancy: ' + 
                        Math.floor(lifeExpectancy) + ' years.<br>Death rate: ' + deathRate.toExponential(2) + ".<br>" + 
                        "<span class='godText'> You have " + floatNumberFormat(soulPoints) + " soul points, boosting growth rate by " + floatNumberFormat(soulPoints + 1) +"</span></span>";
}

setInterval(updatePopulation, timePerUpdate);

document.addEventListener("DOMContentLoaded", setGameActions);

function setGameActions() {
    document.getElementById("killHumanButton").addEventListener("click", function() {
        if (livingHumans >= 1){
            livingHumans -= 1;
      
            deadSouls += 1;
        
            displayCounters();
        } else {
            TextBox.addText("The entire mortal population is now dead. You have complete control over" +
                            " the underworld, but your realm will stagnate until eternity...")
        }
    });

    document.getElementById("tickspeedUpgrade").addEventListener("click", function() {
        upgradeButton = document.getElementById("tickspeedUpgrade");
        let upgradeCost = upgradeCosts["tickspeedUpgrade"];

        if (upgradeCost <= deadSouls) {
            deadSouls -= upgradeCost
            tickspeed *= 1.05;
            upgradeCosts["tickspeedUpgrade"] *= 1.1;
            upgradeNumbers["tickspeedUpgrade"] += 1;
            upgradeButton.innerHTML = "Buy Tickspeed<br>Cost: " + upgradeCosts["tickspeedUpgrade"].toFixed(2) + " souls";
        }
    });

    document.getElementById("diseaseButton").addEventListener("click", function() {

        if (deadSouls >= 1000) {
            deadSouls -= 1000;
            let sick = livingHumans * 0.95;
            livingHumans -= sick;
            deadSouls += sick;
            TextBox.addText("You inflict a ferocious disease to the humans, effectively killing 95% of them.")
        }
        displayCounters();
    });

    const achievementPlaceHolders = document.querySelectorAll("#achievements .achievement");
    achievementPlaceHolders.forEach(achievement => {
        achievement.addEventListener("click", function() {
            showAchievementDescription(achievement.id);
        });
    });

    document.addEventListener("click", function(event){
        console.log(event.target.classList)
        if (!event.target.classList.contains("achievement")){
            hideAchievementDescription();
        }
    }); 
}
