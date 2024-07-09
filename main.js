//let livingHumans = 2;
//let growthRate = 0.1;
//let maxLivingHumans = 100;
//let growthSlowdown = 2; // exponent 
//let deathRate = 0;
//let deadSouls = 0;
//let mortalRealmNumber = 1;
//let lifeExpectancy = 20;
//let years = 0;
//let tickspeed = 1;
//let soulPoints = 0;
//let maxGrowthAffect = 0.1;
//let soulPointMultiplier = 1;

let lastUpdateTime = 0;
const updatesPerSecond = 60;
const timePerUpdate = 1000 / updatesPerSecond;
const intervalBetweenSave = 3 * 1000;

//upgradeCosts = {
//    "diseaseButton": 1000,
//    "tickspeedUpgrade": 100,
//    "soulVessels": 1000,
//}
//
//upgradeNumbers = {
//    "tickspeedUpgrade": 0,
//    "soulVessels": 0,
//}

function updatePopulation() {
    
    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTime;

    let randomGrowthAffect = (Math.random() * 2 - 1) * gV.maxGrowthAffect;
    if (deltaTime >= timePerUpdate) {
        //console.log("Before %s", gV.livingHumans);
        gV.deathRate = 1 / (gV.lifeExpectancy);
        
        let growth = (gV.soulPoints + 1) * gV.growthRate * gV.livingHumans * (1 - gV.livingHumans / Math.max(gV.maxLivingHumans, gV.livingHumans + 20)) ** gV.growthSlowdown * deltaTime * gV.tickspeed / 1000;
        let deaths = gV.deathRate * gV.livingHumans * deltaTime * gV.tickspeed / 1000;
        //console.log("%s %s %s", growth, randomGrowthAffect, deaths);
        gV.livingHumans += growth * (1 + randomGrowthAffect) - deaths;
        gV.deadSouls += (gV.upgradeNumbers["soulVessels"] + 1) * deaths;
        lastUpdateTime = currentTime;
        gV.years += deltaTime * gV.tickspeed / 1000;
        //console.log("After %s", gV.livingHumans);
    }
    if (Math.floor(gV.livingHumans) <= 0){
        checkAchievement1();
        nextMortalRealm();
    } else if (Math.floor(gV.livingHumans) >= gV.maxLivingHumans){
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
    let soulPointsGain = (Math.max(0, Math.log10(gV.deadSouls) * gV.soulPointMultiplier - gV.soulPoints));
    text.innerHTML = "<span style='font-size: 25px;'>You are entering mortal realm " + numberFormat(gV.mortalRealmNumber) + ".</span><br>" + 
                        "<span class='godText'>You led the humans for " + floatNumberFormat(gV.years) + " years.<br>" +
                        "For the souls you've watched over, I'll give you " + floatNumberFormat(soulPointsGain) + 
                        " soul points.</span><br>Click anywhere to continue...";

    screen.addEventListener("click", hideMortalRealmResetScreen);

    gV.soulPoints += soulPointsGain;
    gV.mortalRealmNumber += 1;
    resetToDefaultValues();
    displayCounters();
}

function resetToDefaultValues() {
    gV.livingHumans = 400;
    gV.growthRate = 0.1;
    gV.maxLivingHumans = 100;
    gV.growthSlowdown = 2; // exponent 
    gV.deathRate = 0;
    gV.deadSouls = 10000;
    gV.lifeExpectancy = 20;
    gV.years = 0;
    gV.tickspeed = 1;

    // Civilisation variables
    gV.isCivilisation = false;
    gV.civName = '';
    gV.nbLivingHumansToAdvance = 450;

    gV.upgradeCosts = {
        "diseaseButton": 1000,
        "tickspeedUpgrade": 100,
        "soulVessels": 1000,
    }
    
    gV.upgradeNumbers = {
        "tickspeedUpgrade": 0,
        "soulVessels": 0,
    } 

    document.getElementById("tickspeedUpgrade").innerHTML = "Buy Tickspeed<br>Cost: 100 souls";
    document.getElementById("soulVessels").style.display = "none";
    document.getElementById("worldTendancy").style.display = "none";

    //technologies = {
    //    "tech-fire": new techUpgrade("Fire", 50, false, true),
    //    "tech-tools1": new techUpgrade("Tools 1", 100, false, false),
    //    "tech-crops": new techUpgrade("Crops", 500, false, false),
    //    "tech-huts": new techUpgrade("Huts", 200, false, false),
    //    "tech-speech": new techUpgrade("Speech", 1000, false, false),
    //    "tech-unlock-soul-vessels": new techUpgrade("Unlock Soul Vessels", 2000, false, false),
    //    "tech-unlock-world-tendancy": new techUpgrade("World Tendancy", 5000, false, false),
    //}
  //
    for(var id in technologies)
    {
      technologies[id].isactive = false;
    }
    updateTechDependencies();

    updateTechButtonsDisplay();
}

function hideMortalRealmResetScreen(){
    document.getElementById("mortalRealmReset").style.display = "none";
}

function buySoulVessel(){
    const soulVesselsButton = document.getElementById("soulVessels");
    if (gV.deadSouls >= gV.upgradeCosts["soulVessels"]){
        gV.deadSouls = 0;
        gV.upgradeNumbers["soulVessels"] += 1;
        gV.upgradeCosts["soulVessels"] *= 1.5;
    }
    soulVesselsButton.innerHTML = "Next Soul Vessel: " + numberFormat(gV.upgradeCosts["soulVessels"]) +" souls" + 
                        '<span class="upgradeDescription" style="font-size: 10px;">Reset souls for a boost to soul gains</span>'
}

function displayCounters() {
    hCounter = Math.floor(gV.livingHumans);
    sCounter = Math.floor(gV.deadSouls);

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
    display = 'You are in mortal realm number ' + 
            gV.mortalRealmNumber + '.<br><span style="font-size: 12px;">It is year '+ Math.floor(gV.years) + 
            ', tickspeed is ' + floatNumberFormat(gV.tickspeed) +'<br>Human life expectancy: ' + 
            Math.floor(gV.lifeExpectancy) + ' years.<br>Death rate: ' + gV.deathRate.toExponential(2) + ".<br>" + 
            "<span class='godText'> You have " + floatNumberFormat(gV.soulPoints) + " soul points, boosting growth rate by " + floatNumberFormat(gV.soulPoints + 1) +"</span></span>";

    if (gV.isCivilisation){
        display += '<br><span style="font-size: 12px;">You are in the ' + gV.civName + " empire era.</span>"
    }
    document.getElementById("statisticsDisplay").innerHTML = display;
}

function advanceCivilisation(){
    if (gV.nbLivingHumansToAdvance <= gV.livingHumans){
        gV.isCivilisation = true;
        gV.civName = generateCivName();
        gV.nbLivingHumansToAdvance *= 10;
        document.getElementById("advanceCivButton").innerHTML = "Advance to next civilization" +
            "<span class='upgradeDescription'>"+ gV.nbLivingHumansToAdvance +" living humans</span>";
    }
}

setInterval(updatePopulation, timePerUpdate);
setInterval(saveState, intervalBetweenSave);

// Loading and saving
document.addEventListener("DOMContentLoaded", loadState);


document.onbeforeunload = saveState;
document.addEventListener("beforeunload", saveState);

document.addEventListener("DOMContentLoaded", setGameActions);


function setGameActions() {
    document.getElementById("killHumanButton").addEventListener("click", function() {
        if (gV.livingHumans >= 1){
            gV.livingHumans -= 1;
      
            gV.deadSouls += 1;
        
            displayCounters();
        } else {
            TextBox.addText("The entire mortal population is now dead. You have complete control over" +
                            " the underworld, but your realm will stagnate until eternity...")
        }
    });

    document.getElementById("tickspeedUpgrade").addEventListener("click", function() {
        upgradeButton = document.getElementById("tickspeedUpgrade");
        let upgradeCost = gV.upgradeCosts["tickspeedUpgrade"];

        if (upgradeCost <= gV.deadSouls) {
            gV.deadSouls -= upgradeCost
            gV.tickspeed *= 1.05;
            gV.upgradeCosts["tickspeedUpgrade"] *= 1.1;
            gV.upgradeNumbers["tickspeedUpgrade"] += 1;
            upgradeButton.innerHTML = "Buy Tickspeed<br>Cost: " + gV.upgradeCosts["tickspeedUpgrade"].toFixed(2) + " souls";
        }
    });

    document.getElementById("diseaseButton").addEventListener("click", function() {

        if (gV.deadSouls >= 1000) {
            gV.deadSouls -= 1000;
            let sick = gV.livingHumans * 0.95;
            gV.livingHumans -= sick;
            gV.deadSouls += sick;
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



