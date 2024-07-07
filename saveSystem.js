function gameState(
  technologies,
  upgradeNumbers,
) 
{
  this.livingHumans = livingHumans;
  this.growthRate = growthRate;
  this.maxLivingHumans = maxLivingHumans;
  this.growthSlowdown = growthSlowdown; // exponent 
  this.deathRate = deathRate;
  this.deadSouls = deadSouls;
  this.mortalRealmNumber = mortalRealmNumber;
  this.lifeExpectancy = lifeExpectancy;
  this.years = years;
  this.tickspeed = tickspeed;
  this.soulPoints = soulPoints;
  this.maxGrowthAffect = maxGrowthAffect;
  this.soulPointMultiplier = soulPointMultiplier;

  // To implement offline later
  this.stateTime = Date.now();

  this.techTree = {};

  for(const [key, value] of Object.entries(technologies))
  {
    this.techTree["key"] = value.isactive;
  }
  this.upgradeNumbers = 
  {
      "tickspeedUpgrade" : upgradeNumbers["tickspeedUpgrade"]
      "soulVessels" : upgradeNumbers["soulVessels"];
  }
}



function saveState(currentState)
{
  const stateData = {
    livingHumans: gameState.livingHumans,
    growthRate: gameState.growthRate,
    maxLivingHumans: gameState.maxLivingHumans,
    growthSlowdown: gameState.growthSlowdown,
    deathRate: gameState.deathRate,
    deadSouls: gameState.deadSouls,
    mortalRealmNumber: gameState.mortalRealmNumber,
    lifeExpectancy: gameState.lifeExpectancy,
    years: gameState.years,
    tickspeed: gameState.tickspeed,
    soulPoints: gameState.soulPoints,
    maxGrowthAffect: gameState.maxGrowthAffect,
    soulPointMultiplier: gameState.soulPointMultiplier,
    stateTime: gameState.stateTime,
    techTree: gameState.techTree,
    upgradeNumbers: gameState.upgradeNumbers
  };
  document.cookie = `gameState=${encodeURIComponent(JSON.stringify(stateData))};path=/;max-age=31536000`; // keep the cookie 1 year in memory

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


}
