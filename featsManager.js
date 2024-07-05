achievements_descriptions = {
    'a1': '<h5>Not a chance for the living.</h5> </br> Be the proud owner of less than 5 souls with no more live humans.',
}

achievement_names = {
    'a1': "Not a chance for the living",
}

achievement_unlocks = {
    'a1': false,
}

function getAchievementDescription(achievementId) {
    return achievements_descriptions[achievementId];
} 

function showAchievementFooterOnUnlock(achievementName){
    const notification = document.getElementById('achievementNotification');
    notification.textContent = `${achievementName}`;
    notification.classList.add('active');
  
    setTimeout(() => {
      notification.classList.remove('active');
    }, 5000);
}

function showAchievementDescription(achievementId) {
    const achievementPopup = document.getElementById("achievementPopup");
    const achievementDescription = document.getElementById("achievementDescription");

    const description = getAchievementDescription(achievementId);
    achievementDescription.innerHTML = description;
    console.log(description)

    const achievement = document.getElementById(achievementId);
    const rect = achievement.getBoundingClientRect();
    achievementPopup.style.left = (rect.left + rect.width) + "px";
    achievementPopup.style.top = (rect.top + rect.height / 2 - achievementPopup.offsetHeight / 2) + "px";

    achievementPopup.style.display = "block";
}

function hideAchievementDescription() {
    document.getElementById("achievementPopup").style.display = "none";
}

function checkAchievement1(){
    if ((!achievement_unlocks['a1']) && (Math.floor(livingHumans) == 0) && (deadSouls < 6)) {
        achievement_unlocks['a1'] = true;
        showAchievementFooterOnUnlock('Not a chance for the living');
        const a1 = document.getElementById("a1");
        a1.src = "sprites/a1_sprite.png";
    }
}