let livingHumans = 2;
let growthRate = 0.1;
let maxLivingHumans = 100;
let growthSlowdown = 2; // exponent 
let deathRate = 0.01;
let deadSouls = 0;
let mortalRealmNumber = 1;

let lastUpdateTime = 0;
const updatesPerSecond = 60;
const timePerUpdate = 1000 / updatesPerSecond;

function updatePopulation() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTime;

    if (deltaTime >= timePerUpdate) {
        let growth = growthRate * livingHumans * (1 - livingHumans / maxLivingHumans) ** growthSlowdown * deltaTime / 1000;
        let deaths = deathRate * livingHumans * deltaTime / 1000;
        livingHumans += growth - deaths;
        deadSouls += deaths;
        lastUpdateTime = currentTime;
    }
    if (Math.floor(livingHumans) <= 0){
        checkAchievement1();
        nextMortalRealm();
    }
    displayCounters();
}

function nextMortalRealm() {
    displayMortalRealmResetScreen();
    TextBox.addText("You are entering the mortal realm number " + mortalRealmNumber);
}

function displayMortalRealmResetScreen(){
    const screen = document.getElementById("mortalRealmReset");
    screen.style.display = "block";
    screen.addEventListener("click", hideMortalRealmResetScreen);

    livingHumans = 2;
    deadSouls = 0;
    displayCounters();
}

function hideMortalRealmResetScreen(){
    document.getElementById("mortalRealmReset").style.display = "none";
}

function displayCounters() {
    document.getElementById('living-humans').innerText = `Living Humans: ${Math.floor(livingHumans)}`;
    document.getElementById('dead-souls').innerText = `Souls: ${Math.floor(deadSouls)}`;
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
            TextBox.addText("The entire mortal population is now dead. You have complete control over the underworld, but your realm will stagnate until eternity...")
        }
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