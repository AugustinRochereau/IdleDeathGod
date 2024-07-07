

function saveState()
{
  
  console.log("Saving");
  let stateTime = Date.now();
  let techTree = {};
  for(const [key, value] of Object.entries(technologies))
  {
    techTree[key] = value.isactive;
  }

  const stateData = {
    livingHumans: livingHumans,
    growthRate: growthRate,
    maxLivingHumans: maxLivingHumans,
    growthSlowdown: growthSlowdown,
    deathRate: deathRate,
    deadSouls: deadSouls,
    mortalRealmNumber: mortalRealmNumber,
    lifeExpectancy: lifeExpectancy,
    years: years,
    tickspeed: tickspeed,
    soulPoints: soulPoints,
    maxGrowthAffect: maxGrowthAffect,
    soulPointMultiplier: soulPointMultiplier,
    stateTime: stateTime,
    techTree: techTree,
    upgradeNumbers: upgradeNumbers
  };
  document.cookie = `gameState=${encodeURIComponent(JSON.stringify(stateData))};path=/;max-age=31536000;SameSite=Lax`; // keep the cookie 1 year in memory

}


function loadState()
{  
  const cookies = document.cookie.split('; ');
  const gameStateCookie = cookies.find(cookie => cookie.startsWith('gameState='));
  if(!gameStateCookie)
  {
    // Pas de cookie  
    resetToDefaultValues(); 
  }
  else
  {
    const gameStateData = JSON.parse(decodeURIComponent(gameStateCookie.split('=')[1]));
    

    livingHumans = gameStateData.livingHumans ;
    growthRate = gameStateData.growthRate ;
    maxLivingHumans = gameStateData.maxLivingHumans ;
    growthSlowdown = gameStateData.growthSlowdown ; // exponent 
    deathRate = gameStateData.deathRate ;
    deadSouls = gameStateData.deadSouls ;
    mortalRealmNumber = gameStateData.mortalRealmNumber ;
    lifeExpectancy = gameStateData.lifeExpectancy ;
    years = gameStateData.years ;
    tickspeed = gameStateData.tickspeed ;
    soulPoints = gameStateData.soulPoints ;
    maxGrowthAffect = gameStateData.maxGrowthAffect ;
    soulPointMultiplier = gameStateData.soulPointMultiplier ;
    
    
    for(var key in upgradeNumbers)
    {
      upgradeNumbers[key] = gameStateData.upgradeNumbers[key];
    }

    for(var key in technologies)
    {
      technologies[key].isactive = gameStateData.techTree[key];
    }

    updateTechDependencies();
    updateTechButtonsDisplay();
  }
}
