let livingHumans = 2;
let growthRate = 0.1;
let maxLivingHumans = 100;
let growthSlowdown = 2; // exponent 
let deathRate = 0;
let deadSouls = 100;
let mortalRealmNumber = 1;
let lifeExpectancy = 20;
let years = 0;
let tickspeed = 1;
let soulPoints = 0;
let maxGrowthAffect = 0.1;

let lastUpdateTime = 0;
const updatesPerSecond = 60;
const timePerUpdate = 1000 / updatesPerSecond;

upgradeCosts = {
    "technologyUpgrade": 50,
    "diseaseButton": 1000,
    "tickspeedUpgrade": 100,
}

upgradeNumbers = {
    "technologyUpgrade": 0,
    "diseaseButton": 0,
    "tickspeedUpgrade": 0,
}

techUpgradeNames = {
    1: "Fire",
    2: "Tools",
    3: "Crops",
}

techUpgradeHeaderNews = {
    1: "You bring humans fire. It helps them survive.",
    2: "Out of boredom, you take human form and explain to one guy how to make tools using rocks. He was very impressed.",
    3: "Growing crops helps the little lifeforms develop a settlement."
}


function updatePopulation() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTime;

    let randomGrowthAffect = (Math.random() * 2 - 1) * maxGrowthAffect;

    if (deltaTime >= timePerUpdate) {
        deathRate = 1 / (lifeExpectancy);

        let growth = Math.sqrt(soulPoints + 1) * growthRate * livingHumans * (1 - livingHumans / maxLivingHumans) ** growthSlowdown * deltaTime * tickspeed / 1000;
        let deaths = deathRate * livingHumans * deltaTime * tickspeed / 1000;
        livingHumans += growth * (1 + randomGrowthAffect) - deaths;
        deadSouls += deaths;
        lastUpdateTime = currentTime;
        years += deltaTime * tickspeed / 1000;
    }
    if (Math.floor(livingHumans) <= 0){
        checkAchievement1();
        nextMortalRealm();
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
    let soulPointsGain = Math.floor(Math.max(0, Math.log10(deadSouls)));
    text.innerHTML =  "<span style='font-size: 30px;'>You are entering mortal realm number " + numberFormat(mortalRealmNumber) + ".</span><br>" +
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
    deadSouls = 100;
    lifeExpectancy = 20;
    years = 0;
    tickspeed = 1;

    upgradeCosts = {
        "technologyUpgrade": 50,
        "diseaseButton": 1000,
        "tickspeedUpgrade": 100,
    }
    
    upgradeNumbers = {
        "technologyUpgrade": 0,
        "diseaseButton": 0,
        "tickspeedUpgrade": 0,
    }   

    document.getElementById("technologyUpgrade").innerHTML = "Fire<br>Cost: 50 souls";
    document.getElementById("tickspeedUpgrade").innerHTML = "Buy Tickspeed<br>Cost: 100 souls";
}

function hideMortalRealmResetScreen(){
    document.getElementById("mortalRealmReset").style.display = "none";
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
                        "<span class='godText'> You have " + numberFormat(soulPoints) + " soul points, boosting growth rate by " + floatNumberFormat(Math.sqrt(soulPoints + 1)) +"</span></span>";
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

    document.getElementById("technologyUpgrade").addEventListener("click", function(){
        upgradeButton = document.getElementById("technologyUpgrade");
        let upgradeCost = upgradeCosts["technologyUpgrade"];

        if (upgradeCost <= deadSouls) {
            deadSouls -= upgradeCost
            maxLivingHumans *= 2;
            upgradeCosts["technologyUpgrade"] *= 2;
            upgradeNumbers["technologyUpgrade"] += 1;
            if ((upgradeNumbers["technologyUpgrade"] + 1) in techUpgradeNames){
                upgradeButton.innerHTML = techUpgradeNames[upgradeNumbers["technologyUpgrade"] + 1] + "<br>Cost: " + upgradeCosts["technologyUpgrade"] + " souls";
            } else {
                upgradeButton.style.color = 'gray';
                upgradeButton.removeEventListener("click", this);
            }

            TextBox.addText(techUpgradeHeaderNews[upgradeNumbers["technologyUpgrade"]]);
        }

        displayCounters();
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
        let sick = livingHumans * 0.9;
        livingHumans -= sick;
        deadSouls += sick;
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